import { ISceneObject } from "./ISceneObject";

export class Scene implements ISceneObject {
    private readonly sceneObjects: ISceneObject[] = [];

    add(obj: ISceneObject): void {
        this.sceneObjects.push(obj);
    }

    update(): void {
        this.sceneObjects.forEach(obj => obj.update());
    }

    draw(lagFix: number): void {
        this.sceneObjects.forEach(obj => obj.draw(lagFix));
    }
}