import { Angle } from "./Angle";
import ColorPalette from "./ColorPalette";
import { GamePoint2D } from "./GamePoint2D";
import { SemiCircle } from "./SemiCircle";

export class SnakeTail {
    private center: GamePoint2D;
    private startAngle: Angle;

    constructor(private readonly radius: number, private readonly semiCircle: SemiCircle) { }

    getRadius() {
        return this.radius;
    }

    changeCenter(center: GamePoint2D): void {
        this.center = center;
    }

    changeStartAngle(startAngle: Angle): void {
        this.startAngle = Angle.fromDegrees(startAngle.degrees + 180);
    }

    draw(lagFix: number): void {
        this.semiCircle.changeColor(ColorPalette.SNAKE);
        this.semiCircle.changeCenter(this.center);
        this.semiCircle.changeRadius(this.radius);
        this.semiCircle.changeStartAngle(this.startAngle);
        this.semiCircle.draw();
    }
}