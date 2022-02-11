import ColorPalette from "./ColorPalette";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class BoundingBox {
    constructor(private readonly leftBottom: Point2D, private readonly leftTop: Point2D, private readonly rightBottom: Point2D, private readonly rightTop: Point2D) { }

    overlaps(other: BoundingBox): boolean {
        return other.leftBottom.x >= this.leftBottom.x && other.leftBottom.y >= this.leftBottom.y &&
            other.rightBottom.x <= this.rightBottom.x && other.rightBottom.y >= this.rightBottom.y &&
            other.leftTop.x >= this.leftTop.x && other.leftTop.y <= this.leftTop.y &&
            other.rightTop.x <= this.rightTop.x && other.rightTop.y <= this.rightTop.y;
    }

    anyInside(points: Point2D[]): boolean {
        return points.some(p => this.isInside(p));
    }

    isInside(point: Point2D): boolean {
        return point.x >= this.leftBottom.x && point.y >= this.leftBottom.y &&
            point.x <= this.rightBottom.x && point.y >= this.rightBottom.y &&
            point.x >= this.leftTop.x && point.y <= this.leftTop.y &&
            point.x <= this.rightTop.x && point.y <= this.rightTop.y;
    }
}