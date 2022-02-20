import { GamePoint2D } from "./GamePoint2D";

/**
 * Represents a bounding box of an object.
 */
export class BoundingBox {
    constructor(private readonly leftBottom: GamePoint2D, private readonly leftTop: GamePoint2D, private readonly rightBottom: GamePoint2D, private readonly rightTop: GamePoint2D) { }

    /**
     * Checks whether this bounding box overlaps the given one.
     * @param other the box to check.
     * @returns whether the boxes overlap.
     */
    boxInsideEachOther(other: BoundingBox): boolean {
        return this.overlapsDirect(other, this) || this.overlapsDirect(this, other);
    }

    getCenter(): GamePoint2D {
        return new GamePoint2D((this.rightBottom.x + this.leftBottom.x) / 2, (this.leftTop.y + this.leftBottom.y) / 2);
    }

    private overlapsDirect(inside: BoundingBox, outside: BoundingBox): boolean {
        return inside.leftBottom.x >= outside.leftBottom.x && inside.leftBottom.y >= outside.leftBottom.y &&
            inside.rightBottom.x <= outside.rightBottom.x && inside.rightBottom.y >= outside.rightBottom.y &&
            inside.leftTop.x >= outside.leftTop.x && inside.leftTop.y <= outside.leftTop.y &&
            inside.rightTop.x <= outside.rightTop.x && inside.rightTop.y <= outside.rightTop.y;
    }

    anyPointInside(points: GamePoint2D[]): boolean {
        return points.some(p => this.isPointIside(p));
    }

    private isPointIside(point: GamePoint2D): boolean {
        return point.x >= this.leftBottom.x && point.y >= this.leftBottom.y &&
            point.x <= this.rightBottom.x && point.y >= this.rightBottom.y &&
            point.x >= this.leftTop.x && point.y <= this.leftTop.y &&
            point.x <= this.rightTop.x && point.y <= this.rightTop.y;
    }
}