import { Point2D } from "./Point2D";

const interpolateSingle = (from: Point2D, to: Point2D, t: number): Point2D => {
    return new Point2D(
        (1 - t) * from.x + t * to.x, (1 - t) * from.y + t * to.y
    );
}

const interpolate = (from: Point2D, to: Point2D, step: number): Point2D[] => {
    const interpolated = [];
    for (let t = step; t < 1; t += step) {
        interpolated.push(interpolateSingle(from, to, t));
    }
    return interpolated;
}

export default interpolate;