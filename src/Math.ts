import { Angle } from "./Angle";
import { GamePoint2D } from "./GamePoint2D";
import { Vector2D } from "./Vector2D";

export const median = (values: number[]): number => {
    if (values.length === 0) {
        return 0;
    }
    if (values.length === 1) {
        return values[0];
    }
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}

export const atan3 = (y: number, x: number): Angle => {
    if (x === 0 && y === 0) {
        return undefined;
    }
    let deg = Math.atan2(y, x) * (180 / Math.PI);
    if (deg < 0) {
        deg += 360;
    }
    return Angle.fromDegrees(deg);
}

export const normalize = (vec: Vector2D): Vector2D => {
    const unit = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
    if (unit === 0) {
        return undefined;
    }
    const normalizedX = vec.x / unit;
    const normalizedY = vec.y / unit;
    return new Vector2D(normalizedX, normalizedY);
}

export const fpEquals = (a: number, b: number, epsilon: number): boolean => {
    return Math.abs(a - b) < epsilon;
}

export const closestRotation = (targetDegrees: number, currentDegrees: number): number => {
    if (fpEquals(targetDegrees, currentDegrees, 0.01)) {
        return 0;
    }
    const alpha = targetDegrees - currentDegrees;
    const beta = targetDegrees - currentDegrees + 360;
    const gamma = targetDegrees - currentDegrees - 360;
    if (Math.abs(alpha) <= Math.abs(beta) && Math.abs(alpha) <= Math.abs(gamma)) {
        if (alpha < 0) {
            return -1;
        } else {
            return 1;
        }
    } else if (Math.abs(beta) < Math.abs(alpha) && Math.abs(beta) < Math.abs(gamma)) {
        if (beta < 0) {
            return -1;
        } else {
            return 1;
        }
    } else if (Math.abs(gamma) < Math.abs(alpha) && Math.abs(gamma) < Math.abs(beta)) {
        if (gamma < 0) {
            return -1;
        } else {
            return 1;
        }
    }
}

const onSegment = (pointA: GamePoint2D, pointB: GamePoint2D, pointC: GamePoint2D) => {
    if (pointB.x <= Math.max(pointA.x, pointC.x) && pointB.x >= Math.min(pointA.x, pointC.x) &&
        pointB.y <= Math.max(pointA.y, pointC.y) && pointB.y >= Math.min(pointA.y, pointC.y)) {
        return true;
    }
    return false;
}

const orientation = (pointA: GamePoint2D, pointB: GamePoint2D, pointC: GamePoint2D) => {
    let val = (pointB.y - pointA.y) * (pointC.x - pointB.x) - (pointB.x - pointA.x) * (pointC.y - pointB.y);
    if (val == 0) {
        return 0;
    }
    return (val > 0) ? 1 : 2;
}

export const lineSegmentsIntersect = (a: GamePoint2D, b: GamePoint2D, c: GamePoint2D, d: GamePoint2D) => {
    // Ignore collinearity.
    if (a.x - b.x !== 0 && c.x - d.x !== 0) {
        const slope1 = (a.y - b.y) / (a.x - b.x);
        const slope2 = (c.y - d.y) / (c.x - d.x);
        if (Math.abs((slope1 - slope2)) < 0.001) {
            return false;
        }
    }
    let o1 = orientation(a, b, c);
    let o2 = orientation(a, b, d);
    let o3 = orientation(c, d, a);
    let o4 = orientation(c, d, b);
    if (o1 != o2 && o3 != o4) {
        return true;
    }
    if (o1 == 0 && onSegment(a, c, b)) {
        return true;
    }
    if (o2 == 0 && onSegment(a, d, b)) {
        return true;
    }
    if (o3 == 0 && onSegment(c, a, d)) {
        return true;
    }
    if (o4 == 0 && onSegment(c, b, d)) {
        return true;
    }
    return false;
}