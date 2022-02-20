import { BoundingBox } from "./BoundingBox";
import { GamePoint2D } from "./GamePoint2D";

export class OutsideGameArea {
    constructor(private width: number, private height: number) { }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    inside(points: GamePoint2D[]) {
        const outsideLeft = points.some(p => p.x < 0);
        const outsideRight = points.some(p => p.x > this.width);
        const outsideTop = points.some(p => p.y > this.height);
        const outsideBottom = points.some(p => p.y < 0);
        return outsideLeft || outsideRight || outsideTop || outsideBottom;
    }
}