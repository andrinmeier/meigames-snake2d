import { glMatrix, mat3 } from "gl-matrix";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { ISceneObject } from "./ISceneObject";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class Food implements ISceneObject {
    private readonly position: ScenePosition;
    private readonly color: SceneColor;
    private box: BoundingBox;
    private verticesLength: number;
    private center: Point2D;

    constructor(private readonly foodRadius: number, readonly context: any, shaderProgram: any) {
        this.position = new ScenePosition(this.context, shaderProgram);
        this.color = new SceneColor(this.context, shaderProgram);
    }

    getRadiusValue() {
        return this.foodRadius;
    }

    respawn(center: Point2D) {
        this.center = center;
        this.init();
    }

    init() {
        const vertices = [];
        let leftBottom: Point2D;
        let leftTop: Point2D;
        let rightBottom: Point2D;
        let rightTop: Point2D;
        vertices.push(this.center.x)
        vertices.push(this.center.y);
        const radius = this.getRadiusValue();
        for (let degrees = 0; degrees <= 360; degrees++) {
            const x = this.center.x + radius * Math.cos(glMatrix.toRadian(degrees));
            const y = this.center.y + radius * Math.sin(glMatrix.toRadian(degrees));
            vertices.push(x);
            vertices.push(y);
            if (degrees === 45) {
                rightTop = new Point2D(x, y);
            } else if (degrees === 3 * 45) {
                leftTop = new Point2D(x, y);
            } else if (degrees === 5 * 45) {
                leftBottom = new Point2D(x, y);
            } else if (degrees === 7 * 45) {
                rightBottom = new Point2D(x, y);
            }
        }
        this.verticesLength = vertices.length;
        this.position.setValues(vertices);
        this.box = new BoundingBox(leftBottom, leftTop, rightBottom, rightTop);
    }
    
    anyInside(points: Point2D[]): boolean {
        return this.box.anyInside(points);
    }

    update(): void {
    }

    draw(lagFix: number): void {
        this.position.activate();
        this.color.setColor(ColorPalette.DARKRED);
        this.color.activate();
        this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.verticesLength / 2);
    }
}