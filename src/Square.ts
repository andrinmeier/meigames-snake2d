import { glMatrix, mat3 } from "gl-matrix";
import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { ISceneObject } from "./ISceneObject";
import { ModelMatrix } from "./ModelMatrix";
import { Point2D } from "./Point2D";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";

export class Square implements ISceneObject {
    constructor(readonly start: Point2D, readonly end: Point2D, readonly context: any, readonly position: ScenePosition, readonly color: SceneColor, readonly modelMatrix: ModelMatrix) {
        this.color.setColor(ColorPalette.RED);        
        this.position.setValues([start.x, start.y, end.x, end.y]);
    }

    update(): void {
    }

    draw(lagFix: number): void {
        this.position.activate();
        this.color.activate();
        this.context.drawArrays(this.context.LINES, 0, 4);
    }
}