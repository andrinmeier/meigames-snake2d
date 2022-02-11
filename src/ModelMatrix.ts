import { mat3, mat4 } from "gl-matrix";

export class ModelMatrix {
    private readonly matrixId;

    constructor(readonly context: any, shaderProgram: any) {
        this.matrixId = context.getUniformLocation(shaderProgram, "modelMatrix");
    }

    setValues(matrix: mat3) {
        this.context.uniformMatrix3fv(this.matrixId, false, matrix);
    }
}