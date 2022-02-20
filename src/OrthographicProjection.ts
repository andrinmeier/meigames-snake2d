import { mat4 } from "gl-matrix";

export class OrthographicProjection {
    private readonly matrixId;

    constructor(private readonly context: any, shaderProgram: any) {
        this.matrixId = context.getUniformLocation(shaderProgram, "projectionMatrix");
    }

    setValues(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
        this.context.uniformMatrix4fv(this.matrixId, false, projectionMatrix);
    }
}