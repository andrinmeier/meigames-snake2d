import { glMatrix, mat3 } from "gl-matrix";
import { Angle } from "./Angle";
import ColorPalette from "./ColorPalette";
import { GamePoint2D } from "./GamePoint2D";
import { ModelMatrix } from "./ModelMatrix";
import { ObjectColor } from "./ObjectColor";
import { ObjectPosition } from "./ObjectPosition";

export class SemiCircle {
    private center: GamePoint2D;
    private radius: number;
    private verticesLength: number;
    private color: number[];
    private startAngle: Angle;

    constructor(private readonly context: any, private readonly objectPosition: ObjectPosition, private readonly objectColor: ObjectColor, private readonly modelMatrix: ModelMatrix) {
        this.radius = 1;
        this.center = new GamePoint2D(0, 0);
        this.color = ColorPalette.NONE;
        this.startAngle = Angle.fromDegrees(0);
        this.init();
    }

    changeColor(color: number[]): void {
        this.color = color;
    }

    changeCenter(center: GamePoint2D): void {
        this.center = center;
    }

    changeRadius(radius: number): void {
        this.radius = radius;
    }

    changeStartAngle(startAngle: Angle): void {
        this.startAngle = startAngle;
    }

    private init() {
        const vertices = [];
        vertices.push(0)
        vertices.push(0);
        for (let degrees = 0; degrees <= 180; degrees++) {
            const x = this.center.x + Math.cos(glMatrix.toRadian(degrees));
            const y = this.center.y + Math.sin(glMatrix.toRadian(degrees));
            vertices.push(x);
            vertices.push(y);
        }
        this.verticesLength = vertices.length;
        this.objectPosition.setValues(vertices);
    }

    draw() {
        const modelMat = mat3.create();
        mat3.translate(modelMat, modelMat, [this.center.x, this.center.y]);
        mat3.rotate(modelMat, modelMat, this.startAngle.rad);
        mat3.scale(modelMat, modelMat, [this.radius, this.radius]);
        this.modelMatrix.setValues(modelMat);
        this.objectPosition.activate();
        this.objectColor.setColor(this.color);
        this.objectColor.activate();
        this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.verticesLength / 2);
    }
}