import { Angle } from "./Angle";
import { GamePoint2D } from "./GamePoint2D";
import interpolate from './LinearInterpolation';

export class Line {
    constructor(readonly center: GamePoint2D, readonly phi: Angle, readonly radius: number) {}

    startPoint(): GamePoint2D {
        return new GamePoint2D(
            this.center.x + -this.radius * -1 * Math.sin(this.phi.rad),
            this.center.y + -this.radius * Math.cos(this.phi.rad)
        );
    }

    endPoint(): GamePoint2D {
        return new GamePoint2D(
            this.center.x + this.radius * -1 * Math.sin(this.phi.rad),
            this.center.y + this.radius * Math.cos(this.phi.rad)
        );
    }

    getAllPointsOnLine(): GamePoint2D[] {
        const points = [];
        points.push(this.startPoint());
        const interpolated = interpolate(this.startPoint(), this.endPoint(), 0.01);
        interpolated.forEach(i => points.push(i));
        points.push(this.endPoint());
        return points;
    }
}
