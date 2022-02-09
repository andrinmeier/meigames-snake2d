import { mat3 } from "gl-matrix";
import { BoardPosition } from "./BoardPosition";
import ColorPalette from "./ColorPalette";
import { ModelMatrix } from "./ModelMatrix";
import { SceneColor } from "./SceneColor";
import { ISceneObject } from "./ISceneObject";
import { ScenePosition } from "./ScenePosition";

export class Cell implements ISceneObject {
    private isOccupied: boolean = false;

    constructor(readonly size: number, readonly position: BoardPosition, readonly scenePosition: ScenePosition, readonly sceneColor: SceneColor, readonly modelMatrix: ModelMatrix) {
        this.scenePosition.setValues([0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5]);
        this.sceneColor.setColor(ColorPalette.BLACK);
    }

    occupy(color: number[]) {
        this.sceneColor.setColor(color);
        this.isOccupied = true;
    }

    free() {
        this.sceneColor.setColor(ColorPalette.BLACK);
        this.isOccupied = false;
    }

    isFree() {
        return this.isOccupied;
    }

    update(): void {
    }

    draw(lagFix: number): void {
        const modelMat = mat3.create();
        mat3.translate(modelMat, modelMat, [this.size * this.position.x, this.size * this.position.y]);
        mat3.scale(modelMat, modelMat, [this.size, this.size]);
        this.modelMatrix.setValues(modelMat);
    }
}