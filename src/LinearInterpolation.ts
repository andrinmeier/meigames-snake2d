import { GamePoint2D } from "./GamePoint2D";

const interpolateSingle = (from: GamePoint2D, to: GamePoint2D, t: number): GamePoint2D => {
    return new GamePoint2D(
        (1 - t) * from.x + t * to.x, (1 - t) * from.y + t * to.y
    );
}

const interpolate = (from: GamePoint2D, to: GamePoint2D, step: number): GamePoint2D[] => {
    const interpolated = [];
    for (let t = step; t < 1; t += step) {
        interpolated.push(interpolateSingle(from, to, t));
    }
    return interpolated;
}

export default interpolate;