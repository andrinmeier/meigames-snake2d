export class ScenePosition {
    private readonly positionId: any;
    private readonly buffer: any;

    constructor(readonly context: any, shaderProgram: any) {
        this.positionId = context.getAttribLocation(shaderProgram, "position");
        this.buffer = context.createBuffer();
    }

    setValues(values: number[]) {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
        this.context.bufferData(
            this.context.ARRAY_BUFFER,
            new Float32Array(values),
            this.context.STATIC_DRAW
        );
        this.context.vertexAttribPointer(
            this.positionId,
            3,
            this.context.FLOAT,
            false,
            0,
            0
        );
        this.context.enableVertexAttribArray(this.positionId);
    }
}