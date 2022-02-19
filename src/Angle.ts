import { glMatrix } from "gl-matrix";

export class Angle {
    degrees: number;
    constructor(readonly rad: number) {
        if (rad === 0) {
            this.degrees = 0;
        } else {
            this.degrees = rad * (180/Math.PI);
        }
    }

    static fromRad(rad: number) {
        return new Angle(rad);
    }

    static fromDegrees(degrees: number) {
        let normalized = degrees % 360;
        if (normalized < 0) {
            normalized += 360;
        }
        console.log({normalized})
        return new Angle(glMatrix.toRadian(normalized));
    }
}