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
        return new Angle(glMatrix.toRadian(degrees % 360));
    }
}