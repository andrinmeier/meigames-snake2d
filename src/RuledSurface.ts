import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { Line } from "./Line";
import interpolate from "./LinearInterpolation";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class RuledSurface {
    lines: Line[] = [];
    private skeleton: Point2D[] = [];
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

    getLastPoint(): Point2D {
        if (this.lines.length === 0) {
            return null;
        }
        return this.lines[this.lines.length - 1].point;
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
        if (this.lines.length === 0) {
            this.lines.push(line);
            this.skeleton.push(line.point);
        } else {
            const previous = this.lines[this.lines.length - 1];
            this.vertices.push(previous.endPoint().x);
            this.vertices.push(previous.endPoint().y);
            this.vertices.push(previous.startPoint().x);
            this.vertices.push(previous.startPoint().y);
            this.vertices.push(line.endPoint().x);
            this.vertices.push(line.endPoint().y);
            this.vertices.push(line.startPoint().x);
            this.vertices.push(line.startPoint().y);
            this.position.setValues(this.vertices);
            this.lines.push(line);
            //const interpolated = interpolate(previous.point, line.point, 0.01);
            //interpolated.forEach(i => this.skeleton.push(i));
            //interpolated.push(line.point);
            this.lines = this.lines.slice(Math.max(this.lines.length - this.maxPoints, 0));
            this.vertices = this.vertices.slice(Math.max(this.vertices.length - this.maxPoints * 4, 0));
            //this.skeleton = this.skeleton.slice(Math.max(this.skeleton.length - (1 + ((this.maxPoints - 1) * 100)), 0));
        }
    }

    getHitBox(previous: Line, last: Line): BoundingBox {
        return new BoundingBox(
            previous.startPoint(),
            previous.endPoint(),
            last.startPoint(),
            last.endPoint()
        )
    }

    getAllHitBoxes(): BoundingBox[] {
        const boxes = [];
        for (let i = 1; i < this.lines.length; i++) {
            const previous = this.lines[i - 1];
            const last = this.lines[i];
            boxes.push(this.getHitBox(previous, last));
        }
        return boxes;
    }

    overlaps(other: BoundingBox) {
        const all = this.getAllHitBoxes();
        return all.some(box => box.overlaps(other));
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

    onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
            return true;
        }
        return false;
    }

    orientation(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val == 0) return 0;
        return (val > 0) ? 1 : 2;
    }

    doIntersect(p1, q1, p2, q2) {
        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);
        if (o1 != o2 && o3 != o4)
            return true;
        if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;
        if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;
        if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;
        if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;
        return false;
    }

    hitItself() {
        const segmentLength = 5;
        const buffer = 2 * segmentLength;
        if (this.lines.length < (2 * segmentLength + buffer)) {
            return false;
        }
        const head = [this.lines[this.lines.length - segmentLength].point, this.lines[this.lines.length - 1].point];
        for (let i = 0; i < (this.lines.length - segmentLength - buffer); i += segmentLength) {
            const current = [this.lines[i].point, this.lines[i + segmentLength].point];
            if (this.doIntersect(current[0], current[1], head[0], head[1])) {
                console.log({ i });
                console.log({ head });
                console.log({ current });
                return true;
            }
        }
        return false;
    }

    toPointName(point: Point2D) {
        return `${point.x.toFixed(2)}.${point.y.toFixed(2)}`;
    }

    dotProduct(a: Point2D, b: Point2D): number {
        return a.x * b.x + a.y * b.y;
    }

    normalize(point: Point2D): Point2D {
        const unit = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
        return new Point2D(
            point.x / unit,
            point.y / unit
        );
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