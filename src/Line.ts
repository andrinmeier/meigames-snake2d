import { Angle } from "./Angle";
import { Point2D } from "./Point2D";
import interpolate from './LinearInterpolation';

export class Line {
    constructor(readonly point: Point2D, readonly phi: Angle, readonly v: number) {}

    startPoint(): Point2D {
        return new Point2D(
            this.point.x + -this.v * -1 * Math.sin(this.phi.rad),
            this.point.y + -this.v * Math.cos(this.phi.rad)
        );
    }

    endPoint(): Point2D {
        return new Point2D(
            this.point.x + this.v * -1 * Math.sin(this.phi.rad),
            this.point.y + this.v * Math.cos(this.phi.rad)
        );
    }

    getAllPointsOnLine(): Point2D[] {
        const points = [];
        points.push(this.startPoint());
        const interpolated = interpolate(this.startPoint(), this.endPoint(), 0.01);
        interpolated.forEach(i => points.push(i));
        points.push(this.endPoint());
        return points;
    }
}
