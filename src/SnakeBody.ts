import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { Line } from "./Line";
import { GamePoint2D } from "./GamePoint2D";
import { ObjectColor } from "./ObjectColor";
import { ObjectPosition } from "./ObjectPosition";
import { mat3 } from "gl-matrix";
import { ModelMatrix } from "./ModelMatrix";
import { lineSegmentsIntersect } from "./Math";

export class SnakeBody {
    private lines: Line[] = [];
    private maxPoints: number;
    private vertices: number[] = [];
    private readonly position: ObjectPosition;
    private readonly color: ObjectColor;
    private headLength: number = 1;

    constructor(readonly context: any, shaderProgram: any, private readonly bodyRadius: number, private readonly modelMatrix: ModelMatrix) {
        this.position = new ObjectPosition(this.context, shaderProgram);
        this.color = new ObjectColor(this.context, shaderProgram);
    }

    setMaxPoints(maxPoints: number): void {
        this.maxPoints = maxPoints;
        this.headLength = Math.max(10, Math.floor(this.maxPoints * 0.05));
    }

    increaseMaxPoints(addedLength: number): void {
        this.maxPoints += addedLength
        this.headLength = Math.max(10, Math.floor(this.maxPoints * 0.05));
    }

    getHead(): GamePoint2D {
        const headLine = this.getHeadLine();
        if (!headLine) {
            return null;
        }
        return headLine.center;
    }

    getHeadLine(): Line {
        return this.lines[this.lines.length - 1];
    }

    getTailLine(): Line {
        return this.lines[0];
    }

    getHeadLines(): Line[] {
        if (this.lines.length === 0) {
            return [];
        }
        const headLines = [];
        for (let i = this.lines.length - this.headLength; i < this.lines.length; i++) {
            headLines.push(this.lines[i]);
        }
        return headLines;
    }

    addSlice(point: GamePoint2D, angle: Angle) {
        const line = new Line(point, angle, this.bodyRadius);
        this.vertices.push(line.endPoint().x);
        this.vertices.push(line.endPoint().y);
        this.vertices.push(line.startPoint().x);
        this.vertices.push(line.startPoint().y);
        this.lines.push(line);
        const newLineIndex = Math.max(this.lines.length - this.maxPoints, 0);
        const newVerticesIndex = Math.max(this.vertices.length - this.maxPoints * 4, 0);
        this.lines = this.lines.slice(newLineIndex);
        this.vertices = this.vertices.slice(newVerticesIndex);
        this.position.setValues(this.vertices);
    }

    getHitBox(point: GamePoint2D): BoundingBox {
        return new BoundingBox(
            new GamePoint2D(point.x - this.bodyRadius, point.y - this.bodyRadius),
            new GamePoint2D(point.x - this.bodyRadius, point.y + this.bodyRadius),
            new GamePoint2D(point.x + this.bodyRadius, point.y - this.bodyRadius),
            new GamePoint2D(point.x + this.bodyRadius, point.y + this.bodyRadius)
        )
    }

    getAllHitBoxes(): BoundingBox[] {
        const boxes = [];
        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            boxes.push(this.getHitBox(line.center));
        }
        return boxes;
    }

    getHeadPoints(): GamePoint2D[] {
        const points = [];
        for (const headLine of this.getHeadLines()) {
            const linePoints = this.getIntersectionPoints(headLine);
            linePoints.forEach(p => points.push(p));
        }
        return points;
    }

    getIntersectionPoints(line: Line): GamePoint2D[] {
        const all = line.getAllPointsOnLine();
        const size = all.length;
        const firstQuarter = Math.floor(size * 0.20);
        const lastQuarter = Math.floor(size * 0.80);
        const innerBodyOnly = all.slice(firstQuarter, lastQuarter);
        return innerBodyOnly;
    }

    hitItself() {
        const segmentLength = 10;
        const buffer = 5 * segmentLength;
        if (this.lines.length < (2 * segmentLength + buffer)) {
            return false;
        }
        // Represent the head as a straight line inside the skeleton.
        const head = [this.lines[this.lines.length - segmentLength].center, this.lines[this.lines.length - 1].center];
        // Go through the entire body to check if the head intersects any part of it.
        for (let i = 0; i < (this.lines.length - segmentLength - buffer); i += segmentLength) {
            const current = [this.lines[i].center, this.lines[i + segmentLength].center];
            if (lineSegmentsIntersect(current[0], current[1], head[0], head[1])) {
                return true;
            }
        }
        return false;
    }

    anyInside(points: GamePoint2D[]): boolean {
        const all = this.getAllHitBoxes();
        return all.some(box => box.anyPointInside(points));
    }

    draw(lagFix) {
        const modelMat = mat3.create();
        mat3.translate(modelMat, modelMat, [0, 0]);
        this.modelMatrix.setValues(modelMat);
        this.position.activate();
        this.color.setColor(ColorPalette.SNAKE);
        this.color.activate();
        this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.vertices.length / 2);
    }
}