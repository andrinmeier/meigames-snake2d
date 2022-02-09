export class SceneColor {
    private readonly colorId: any;

    constructor(readonly context: any, shaderProgram: any) {
        this.colorId = context.getUniformLocation(shaderProgram, "color");
    }

    setColor(color: number[]) {
        this.context.uniform3fv(this.colorId, new Float32Array(color));
    }
}