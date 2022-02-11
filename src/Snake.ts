import { glMatrix } from "gl-matrix";
import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import { ISceneObject } from "./ISceneObject";
import { ModelMatrix } from "./ModelMatrix";
import { Point2D } from "./Point2D";
import { RuledSurface } from "./RuledSurface";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";
import { Square } from "./Square";
import { Velocity } from "./Velocity";

export class Snake implements ISceneObject {
    private currentVelocity: Velocity;
    private readonly surface: RuledSurface;
    stopped: boolean;

    constructor(readonly context: any, shaderProgram: any) {
        this.currentVelocity = new Velocity(Angle.fromDegrees(0), 1);
        this.surface = new RuledSurface(context, shaderProgram);
    }
    changeDirection(angleDifference: number) {
        const newAngle = Angle.fromDegrees((this.currentVelocity.angle.degrees + angleDifference) % 360);
        this.currentVelocity = new Velocity(newAngle, 1);
    }

    changeBodyLength(newLength: number): void {
        this.surface.setMaxPoints(newLength);
    }

    increaseBodyLength(addedLength: number): void {
        this.surface.increaseMaxPoints(addedLength);
    }

    grow(count: number): void {
        let pointsCount = count;
        let previous = this.surface.getLastPoint();
        if (!previous) {
            previous = new Point2D(10, 10);
        }
        while (pointsCount > 0) {
            const newPoint = previous.add(this.currentVelocity);
            this.surface.addLine(newPoint, this.currentVelocity.angle);
            previous = newPoint;
            pointsCount--;
        }
    }

    update(): void {
        if (!this.stopped) {
            this.move(1.0);
        }
    }

    draw(lagFix: number): void {
        if (!this.stopped) {
            this.move(lagFix);
        }
        this.surface.draw(lagFix);
    }

    overlaps(other: BoundingBox): boolean {
        return this.surface.overlaps(other);
    }

    getHeadPoints(): Point2D[] {
        return this.surface.getHeadPoints();
    }

    anyInside(points: Point2D[]): boolean {
        return this.surface.anyInside(points);
    }

    hitItself(): boolean {
        return this.surface.hitItself();
    }

    private move(speedFactor: number): void {
        this.grow(speedFactor);
    }
}