import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import { ISceneObject } from "./ISceneObject";
import { GamePoint2D } from "./GamePoint2D";
import { SnakeBody } from "./SnakeBody";
import { ObjectColor } from "./ObjectColor";
import { ObjectPosition } from "./ObjectPosition";
import { Velocity } from "./Velocity";
import { SnakeHead } from "./SnakeHead";
import { SnakeTail } from "./SnakeTail";
import { SemiCircle } from "./SemiCircle";
import { ModelMatrix } from "./ModelMatrix";
import { closestRotation } from "./Math";
export class Snake implements ISceneObject {
    private currentVelocity: Velocity;
    private readonly head: SnakeHead;
    private readonly body: SnakeBody;
    private readonly tail: SnakeTail;
    stopped: boolean;

    constructor(readonly context: any, readonly shaderProgram: any, bodySize: number, private currentSpeed: number) {
        this.currentVelocity = new Velocity(Angle.fromDegrees(0), this.currentSpeed);
        const modelMatrix = new ModelMatrix(context, shaderProgram);
        const semiCircle = new SemiCircle(
            context,
            new ObjectPosition(context, shaderProgram),
            new ObjectColor(context, shaderProgram),
            modelMatrix);
        this.head = new SnakeHead(bodySize, semiCircle);
        this.body = new SnakeBody(context, shaderProgram, bodySize, modelMatrix);
        this.tail = new SnakeTail(bodySize, semiCircle);
    }

    speedUp(speed: number): void {
        this.currentSpeed += speed;
        this.currentSpeed = Math.min(this.currentSpeed, 2.0);
    }

    changeDirection(angleDifference: number) {
        const newAngle = Angle.fromDegrees(this.currentVelocity.angle.degrees + angleDifference);
        this.currentVelocity = new Velocity(newAngle, this.currentSpeed);
    }

    approximateDirection(wantedDegrees: number) {
        const rotationDirection = closestRotation(wantedDegrees, this.currentVelocity.angle.degrees);
        if (rotationDirection === 0) {
            return;
        }
        this.changeDirection(rotationDirection * 5.0);
    }

    restrictBodyLength(newLength: number): void {
        this.body.setMaxPoints(newLength);
    }

    increaseBodyLength(addedLength: number): void {
        this.body.increaseMaxPoints(addedLength);
    }

    grow(count: number): void {
        let pointsCount = count;
        let previous = this.body.getHead();
        if (!previous) {
            previous = new GamePoint2D(50, 50);
        }
        while (pointsCount > 0) {
            const newPoint = previous.add(this.currentVelocity);
            this.body.addSlice(newPoint, this.currentVelocity.angle);
            previous = newPoint;
            pointsCount--;
        }
    }

    update(): void {
        if (this.stopped) {
            return;
        }
        this.move(1);
    }

    draw(lagFix: number): void {
        if (!this.stopped) {
            this.move(lagFix);
        }
        this.head.draw(lagFix);
        // Always draw body, even if game is over so that the player can still look at the snake.
        this.body.draw(lagFix);
        this.tail.draw(lagFix);
    }

    getHitBoxes(): BoundingBox[] {
        return this.body.getAllHitBoxes();
    }

    getHeadPoints(): GamePoint2D[] {
        return this.body.getHeadPoints();
    }

    anyPointsInside(points: GamePoint2D[]): boolean {
        return this.body.anyInside(points);
    }

    hitItself(): boolean {
        return this.body.hitItself();
    }

    getHead(): GamePoint2D {
        return this.body.getHead();
    }

    private move(speedFactor: number): void {
        this.grow(speedFactor);
        const headPoint = this.body.getHeadLine();
        this.head.changeCenter(headPoint.center);
        this.head.changeStartAngle(Angle.fromDegrees(headPoint.phi.degrees - 90));
        const tailPoint = this.body.getTailLine();
        this.tail.changeCenter(tailPoint.center);
        this.tail.changeStartAngle(Angle.fromDegrees(tailPoint.phi.degrees - 90));
    }
}