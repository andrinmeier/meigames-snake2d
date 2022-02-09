export interface ISceneObject {
    update(): void;
    draw(lagFix: number): void;
}