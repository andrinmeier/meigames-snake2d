export class ModelMatrix {
    private readonly matrixId;

    constructor(readonly context: any, shaderProgram: any) {
        this.matrixId = context.getUniformLocation(shaderProgram, "modelMatrix");
    }

    setValues(matrix3: any) {
        this.context.uniformMatrix3fv(this.matrixId, false, matrix3);
    }
}