import { mat4 } from "gl-matrix";

export class ViewMatrix {
    private readonly matrixId;

    constructor(private readonly context: any, private readonly shaderProgram: any) {
        this.matrixId = context.getUniformLocation(shaderProgram, "viewMatrix");
    }

    setValues(eye: [number, number, number], center: [number, number, number], up: [number, number, number]) {
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, eye, center, up);        
        this.context.uniformMatrix4fv(this.matrixId, false, viewMatrix);
    }
}