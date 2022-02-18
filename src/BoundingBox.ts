import ColorPalette from "./ColorPalette";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class BoundingBox {
    constructor(private readonly leftBottom: Point2D, private readonly leftTop: Point2D, private readonly rightBottom: Point2D, private readonly rightTop: Point2D) { }

    overlaps(other: BoundingBox): boolean {
        return this.overlapsDirect(other, this) || this.overlapsDirect(this, other);
    }

    getCenter(): Point2D {
        return new Point2D((this.rightBottom.x + this.leftBottom.x) / 2, (this.leftTop.y + this.leftBottom.y) / 2);
    }

    private overlapsDirect(inside: BoundingBox, outside: BoundingBox): boolean {
        return inside.leftBottom.x >= outside.leftBottom.x && inside.leftBottom.y >= outside.leftBottom.y &&
            inside.rightBottom.x <= outside.rightBottom.x && inside.rightBottom.y >= outside.rightBottom.y &&
            inside.leftTop.x >= outside.leftTop.x && inside.leftTop.y <= outside.leftTop.y &&
            inside.rightTop.x <= outside.rightTop.x && inside.rightTop.y <= outside.rightTop.y;
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