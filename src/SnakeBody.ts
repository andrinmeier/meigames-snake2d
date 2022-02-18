import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { Line } from "./Line";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class SnakeBody {
    lines: Line[] = [];
    private maxPoints: number = 10;
    vertices: number[] = [];
    private readonly v = 5;
    private readonly position: ScenePosition;
    private readonly color: SceneColor;
    private headLength: number = 1;

    constructor(readonly context: any, shaderProgram: any) {
        this.position = new ScenePosition(this.context, shaderProgram);
        this.color = new SceneColor(this.context, shaderProgram);
    }

    setMaxPoints(maxPoints: number): void {
        this.maxPoints = maxPoints;
        this.headLength = Math.max(10, Math.floor(this.maxPoints * 0.05));
    }

    increaseMaxPoints(addedLength: number): void {
        this.maxPoints += addedLength;
        this.headLength = Math.max(10, Math.floor(this.maxPoints * 0.05));
    }

    getHead(): Point2D {
        if (this.lines.length === 0) {
            return null;
        }
        return this.lines[this.lines.length - 1].point;
    }

    getLastLine(): Line {
        return this.lines[this.lines.length - 1];
    }

    getFirstLine(): Line {
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

    addLine(point: Point2D, angle: Angle) {
        const line = new Line(point, angle, this.v);
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
            new Point2D(point.x - this.v, point.y - this.v),
            new Point2D(point.x - this.v, point.y + this.v),
            new Point2D(point.x + this.v, point.y - this.v),
            new Point2D(point.x + this.v, point.y + this.v)
        )
    }

    getAllHitBoxes(): BoundingBox[] {
        const boxes = [];
        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            boxes.push(this.getHitBox(line.point));
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
        const firstQuarter = Math.floor(size * 0.2);
        const lastQuarter = Math.floor(size * 0.80);
        const innerBodyOnly = all.slice(firstQuarter, lastQuarter);
        return innerBodyOnly;
    }

    onSegment(p: Point2D, q: Point2D, r: Point2D) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
            return true;
        }
        return false;
    }

    orientation(p: Point2D, q: Point2D, r: Point2D) {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val == 0) {
            return 0;
        }
        return (val > 0) ? 1 : 2;
    }

    lineSegmentsIntersect(p1: Point2D, q1: Point2D, p2: Point2D, q2: Point2D) {
        // Ignore collinearity.
        if (p1.x - q1.x !== 0 && p2.x - q2.x !== 0) {
            const slope1 = (p1.y - q1.y) / (p1.x - q1.x);
            const slope2 = (p2.y - q2.y) / (p2.x - q2.x);
            if (Math.abs((slope1 - slope2)) < 0.001) {
                return false;
            }
        }
        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);
        if (o1 != o2 && o3 != o4) {
            return true;
        }
        if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;
        if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;
        if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;
        if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;
        return false;
    }

    hitItself() {
        const segmentLength = 10;
        const buffer = 5 * segmentLength;
        if (this.lines.length < (2 * segmentLength + buffer)) {
            return false;
        }
        const head = [this.lines[this.lines.length - segmentLength].point, this.lines[this.lines.length - 1].point];
        for (let i = 0; i < (this.lines.length - segmentLength - buffer); i += segmentLength) {
            const current = [this.lines[i].point, this.lines[i + segmentLength].point];
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