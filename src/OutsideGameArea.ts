import { BoundingBox } from "./BoundingBox";
import { Point2D } from "./Point2D";

export class OutsideGameArea {
    private readonly left: BoundingBox;
    private readonly right: BoundingBox;
    private readonly bottom: BoundingBox;
    private readonly top: BoundingBox;

    constructor(private readonly width: number, private readonly height: number) {
        this.left = new BoundingBox(
            new Point2D(-1000, -height),
            new Point2D(-1000, 2*height),
            new Point2D(0, -height),
            new Point2D(0, 2*height)
        )
        this.right = new BoundingBox(
            new Point2D(this.width, -height),
            new Point2D(this.width, 2*height),
            new Point2D(2*this.width, -height),
            new Point2D(2*this.width, 2*height)
        )
        this.bottom = new BoundingBox(
            new Point2D(0, -height),
            new Point2D(0, 0),
            new Point2D(width, -height),
            new Point2D(width, 0)
        )
        this.top = new BoundingBox(
            new Point2D(0, height),
            new Point2D(0, 2*height),
            new Point2D(width, height),
            new Point2D(width, 2*height)
        )
    }

    inside(points: Point2D[]) {
        return this.left.anyInside(points) || this.right.anyInside(points) || this.bottom.anyInside(points) || this.top.anyInside(points);
    }
}