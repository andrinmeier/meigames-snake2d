import { glMatrix } from "gl-matrix";
import { Velocity } from "./Velocity";

export class Point2D {
    constructor(readonly x: number, readonly y: number) {}

    add(velocity: Velocity) {
        const newX = this.x + velocity.magnitude * Math.cos(velocity.angle.rad);
        const newY = this.y + velocity.magnitude * Math.sin(velocity.angle.rad);
        return new Point2D(newX, newY);
    }

    distance(other: Point2D) {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }
}