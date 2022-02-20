import { glMatrix } from "gl-matrix";
import { Angle } from "./Angle";
import { BoundingBox } from "./BoundingBox";
import ColorPalette from "./ColorPalette";
import { ISceneObject } from "./ISceneObject";
import { Point2D } from "./Point2D";
import { SnakeBody } from "./SnakeBody";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";
import { Velocity } from "./Velocity";
export class Snake implements ISceneObject {
    private currentVelocity: Velocity;
    private readonly body: SnakeBody;
    stopped: boolean;

    constructor(readonly context: any, readonly shaderProgram: any, private readonly bodySize: number, private currentSpeed: number) {
        this.currentVelocity = new Velocity(Angle.fromDegrees(0), this.currentSpeed);
        this.body = new SnakeBody(context, shaderProgram, bodySize);
    }

    speedUp(): void {
        this.currentSpeed += 0.05;
        this.currentSpeed = Math.min(this.currentSpeed, 2.0);
    }

    changeDirection(angleDifference: number) {
        const newAngle = Angle.fromDegrees(this.currentVelocity.angle.degrees + angleDifference);
        this.currentVelocity = new Velocity(newAngle, this.currentSpeed);
    }

    approximateDirection(wantedDegrees: number) {
        const currentDegrees = this.currentVelocity.angle.degrees;
        const alpha = wantedDegrees - currentDegrees;
        const beta = wantedDegrees - currentDegrees + 360;
        const gamma = wantedDegrees - currentDegrees - 360;
        if (Math.abs(alpha) <= Math.abs(beta) && Math.abs(alpha) <= Math.abs(gamma)) {
            if (alpha < 0) {
                this.changeDirection(-5.0);
            } else {
                this.changeDirection(5.0);
            }
        } else if (Math.abs(beta) < Math.abs(alpha) && Math.abs(beta) < Math.abs(gamma)) {
            if (beta < 0) {
                this.changeDirection(-5.0);
            } else {
                this.changeDirection(5.0);
            }
        } else if (Math.abs(gamma) < Math.abs(alpha) && Math.abs(gamma) < Math.abs(beta)) {
            if (gamma < 0) {
                this.changeDirection(-5.0);
            } else {
                this.changeDirection(5.0);
            }
        }
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
            previous = new Point2D(50, 50);
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
        // Always draw body, even if game is over so that the player can still look at the snake.
        this.body.draw(lagFix);
        this.drawHead();
        this.drawTail();
    }

    private drawTail(): void {
        const vertices = [];
        const position = new ScenePosition(this.context, this.shaderProgram);
        const color = new SceneColor(this.context, this.shaderProgram);
        const head = this.body.getTailLine();
        const center = head.center;
        const angle = head.phi;
        const startDegrees = (angle.degrees + 180) - 90;
        const endDegrees = (angle.degrees + 180) + 90;
        for (let deg = startDegrees; deg <= endDegrees; deg++) {
            const x = center.x + this.bodySize * Math.cos(glMatrix.toRadian(deg));
            const y = center.y + this.bodySize * Math.sin(glMatrix.toRadian(deg));
            vertices.push(x);
            vertices.push(y);
        }
        position.setValues(vertices);
        color.setColor(ColorPalette.GREEN);
        position.activate();
        color.activate();
        this.context.drawArrays(this.context.TRIANGLE_FAN, 0, vertices.length / 2);
    }

    private drawHead(): void {
        const vertices = [];
        const position = new ScenePosition(this.context, this.shaderProgram);
        const color = new SceneColor(this.context, this.shaderProgram);
        const head = this.body.getHeadLine();
        const center = head.center;
        const angle = head.phi;
        const startDegrees = angle.degrees - 90;
        const endDegrees = angle.degrees + 90;
        for (let deg = startDegrees; deg <= endDegrees; deg++) {
            const x = center.x + this.bodySize * Math.cos(glMatrix.toRadian(deg));
            const y = center.y + this.bodySize * Math.sin(glMatrix.toRadian(deg));
            vertices.push(x);
            vertices.push(y);
        }
        position.setValues(vertices);
        color.setColor(ColorPalette.GREEN);
        position.activate();
        color.activate();
        this.context.drawArrays(this.context.TRIANGLE_FAN, 0, vertices.length / 2);
    }

    getHitBoxes(): BoundingBox[] {
        return this.body.getAllHitBoxes();
    }

    getHeadPoints(): Point2D[] {
        return this.body.getHeadPoints();
    }

    anyInside(points: Point2D[]): boolean {
        return this.body.anyInside(points);
    }

    hitItself(): boolean {
        return this.body.hitItself();
    }

    getHead(): Point2D {
        return this.body.getHead();
    }

    private move(speedFactor: number): void {
        this.grow(speedFactor);
    }
}