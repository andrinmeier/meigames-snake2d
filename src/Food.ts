import { BoundingBox } from "./BoundingBox";
import { Circle } from "./Circle";
import ColorPalette from "./ColorPalette";
import { GamePoint2D } from "./GamePoint2D";
import { ObjectColor } from "./ObjectColor";
import { ObjectPosition } from "./ObjectPosition";

export class Food {
    private center: GamePoint2D;

    constructor(private readonly radius: number, private readonly circle: Circle) { }

    getRadius() {
        return this.radius;
    }

    respawn(center: GamePoint2D) {
        this.center = center;
    }

    anyPointsInside(points: GamePoint2D[]): boolean {
        return this.circle.anyPointsInside(this.center, this.radius, points);
    }

    draw(lagFix: number): void {
        this.circle.changeColor(ColorPalette.FOOD);
        this.circle.changeCenter(this.center);
        this.circle.changeRadius(this.radius);
        this.circle.draw();
    }
}