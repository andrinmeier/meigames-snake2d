import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { Line } from "./Line";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class SnakeBody {
    private lines: Line[] = [];
    private maxPoints: number;
    private vertices: number[] = [];
    private readonly position: ScenePosition;
    private readonly color: SceneColor;
    private headLength: number = 1;

    constructor(readonly context: any, shaderProgram: any, private readonly bodyRadius: number) {
        this.position = new ScenePosition(this.context, shaderProgram);
        this.color = new SceneColor(this.context, shaderProgram);
    }

    setMaxPoints(maxPoints: number): void {
        this.maxPoints = maxPoints;
        this.headLength = Math.max(10, Math.floor(this.maxPoints * 0.05));
    }

    increaseMaxPoints(addedLength: number): void {
        this.maxPoints += addedLength
        this.headLength = Math.max(10, Math.floor(this.maxPoints * 0.05));
    }

    getHead(): Point2D {
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

    addSlice(point: Point2D, angle: Angle) {
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

    getHitBox(point: Point2D): BoundingBox {
        return new BoundingBox(
            new Point2D(point.x - this.bodyRadius, point.y - this.bodyRadius),
            new Point2D(point.x - this.bodyRadius, point.y + this.bodyRadius),
            new Point2D(point.x + this.bodyRadius, point.y - this.bodyRadius),
            new Point2D(point.x + this.bodyRadius, point.y + this.bodyRadius)
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

    getHeadPoints(): Point2D[] {
        const points = [];
        for (const headLine of this.getHeadLines()) {
            const linePoints = this.getIntersectionPoints(headLine);
            linePoints.forEach(p => points.push(p));
        }
        return points;
    }

    getIntersectionPoints(line: Line): Point2D[] {
        const all = line.getAllPointsOnLine();
        const size = all.length;
        const firstQuarter = Math.floor(size * 0.20);
        const lastQuarter = Math.floor(size * 0.80);
        const innerBodyOnly = all.slice(firstQuarter, lastQuarter);
        return innerBodyOnly;
    }

    onSegment(pointA: Point2D, pointB: Point2D, pointC: Point2D) {
        if (pointB.x <= Math.max(pointA.x, pointC.x) && pointB.x >= Math.min(pointA.x, pointC.x) &&
            pointB.y <= Math.max(pointA.y, pointC.y) && pointB.y >= Math.min(pointA.y, pointC.y)) {
            return true;
        }
        return false;
    }

    orientation(pointA: Point2D, pointB: Point2D, pointC: Point2D) {
        let val = (pointB.y - pointA.y) * (pointC.x - pointB.x) - (pointB.x - pointA.x) * (pointC.y - pointB.y);
        if (val == 0) {
            return 0;
        }
        return (val > 0) ? 1 : 2;
    }

    lineSegmentsIntersect(a: Point2D, b: Point2D, c: Point2D, d: Point2D) {
        // Ignore collinearity.
        if (a.x - b.x !== 0 && c.x - d.x !== 0) {
            const slope1 = (a.y - b.y) / (a.x - b.x);
            const slope2 = (c.y - d.y) / (c.x - d.x);
            if (Math.abs((slope1 - slope2)) < 0.001) {
                return false;
            }
        }
        let o1 = this.orientation(a, b, c);
        let o2 = this.orientation(a, b, d);
        let o3 = this.orientation(c, d, a);
        let o4 = this.orientation(c, d, b);
        if (o1 != o2 && o3 != o4) {
            return true;
        }
        if (o1 == 0 && this.onSegment(a, c, b)) {
            return true;
        }
        if (o2 == 0 && this.onSegment(a, d, b)) {
            return true;
        }
        if (o3 == 0 && this.onSegment(c, a, d)) {
            return true;
        }
        if (o4 == 0 && this.onSegment(c, b, d)) {
            return true;
        }
        return false;
    }

    hitItself() {
        const segmentLength = 10;
        const buffer = 5 * segmentLength;
        if (this.lines.length < (2 * segmentLength + buffer)) {
            return false;
        }
        const head = [this.lines[this.lines.length - segmentLength].center, this.lines[this.lines.length - 1].center];
        for (let i = 0; i < (this.lines.length - segmentLength - buffer); i += segmentLength) {
            const current = [this.lines[i].center, this.lines[i + segmentLength].center];
            if (this.lineSegmentsIntersect(current[0], current[1], head[0], head[1])) {
                return true;
            }
        }
        return false;
    }

    anyInside(points: Point2D[]): boolean {
        const all = this.getAllHitBoxes();
        return all.some(box => box.anyInside(points));
    }

    draw(lagFix) {
        this.position.activate();
        this.color.setColor(ColorPalette.GREEN);
        this.color.activate();
        this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.vertices.length / 2);
    }
}