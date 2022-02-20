import { glMatrix } from "gl-matrix";

/**
 * Represents an angle in rad/degrees.
 */
export class Angle {
    degrees: number;

    /**
     * Create a new instance.
     * @param rad radiants
     */
    constructor(readonly rad: number) {
        this.degrees = rad * (180 / Math.PI);
    }

    /**
     * Create an angle based on the given radiants.
     * @param rad radiants
     * @returns new angle
     */
    static fromRad(rad: number) {
        return new Angle(rad);
    }

    /**
     * Creates a new angle based on the given degrees.
     * @param degrees degrees
     * @returns the new angle
     */
    static fromDegrees(degrees: number) {
        let normalized = degrees % 360;
        if (normalized < 0) {
            normalized += 360;
        }
        return new Angle(glMatrix.toRadian(normalized));
    }
}