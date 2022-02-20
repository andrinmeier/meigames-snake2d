export class ObjectColor {
    private readonly colorId: any;
    private color: number[];

    constructor(readonly context: any, shaderProgram: any) {
        this.colorId = context.getUniformLocation(shaderProgram, "color");
    }

    setColor(color: number[]) {
        this.color = color;
    }

    activate() {
        this.context.uniform3fv(this.colorId, new Float32Array(this.color));
    }
}