import { BoundingBox } from "./BoundingBox";
import { Food } from "./Food";
import { ISceneObject } from "./ISceneObject";
import interpolate from "./LinearInterpolation";
import { ModelMatrix } from "./ModelMatrix";
import { OrthographicProjection } from "./OrthographicProjection";
import { OutsideGameArea } from "./OutsideGameArea";
import { Player } from "./Player";
import { Point2D } from "./Point2D";
import randomValue from "./RandomValue";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";
import { Snake } from "./Snake";
import { Square } from "./Square";
import { ViewMatrix } from "./ViewMatrix";

export class SnakeGame implements ISceneObject {
    private onScoreChanged: (newScore: number) => void;
    private onGameDone: () => void;
    private score: number = 0;
    private snake: Snake;
    private food: Food;
    private player: Player;
    private readonly viewMatrix: ViewMatrix;
    private readonly projection: OrthographicProjection;
    private readonly outsideGame: OutsideGameArea;
    private readonly fieldSize: number = 512;
    private foodRadius: number = 7.5;

    constructor(private readonly context: any, private readonly shaderProgram: any) {
        this.viewMatrix = new ViewMatrix(context, shaderProgram);
        this.projection = new OrthographicProjection(context, shaderProgram);
        this.outsideGame = new OutsideGameArea(512, 512);
        this.player = new Player();
        this.snake = new Snake(context, shaderProgram);
        this.snake.changeBodyLength(100);
        this.snake.grow(100);
        this.food = new Food(this.foodRadius, context, shaderProgram);
        this.respawnFood();
    }

    private respawnFoodRandomly(tries: number, safetyMarginFactor: number): boolean {
        while (tries > 0) {
            const row = randomValue(safetyMarginFactor * this.foodRadius, this.fieldSize - safetyMarginFactor * this.foodRadius);
            const col = randomValue(safetyMarginFactor * this.foodRadius, this.fieldSize - safetyMarginFactor * this.foodRadius);
            const leftBottom = new Point2D(row, col);
            const leftTop = new Point2D(row, col + this.foodRadius);
            const rightBottom = new Point2D(row + this.foodRadius, col);
            const rightTop = new Point2D(row + this.foodRadius, col + this.foodRadius);
            const line0 = interpolate(leftBottom, leftTop, 0.01);
            tries--;
            if (this.snake.anyInside(line0)) {
                continue;
            }
            const line1 = interpolate(leftTop, rightTop, 0.01);
            if (this.snake.anyInside(line1)) {
                continue;
            }
            const line2 = interpolate(leftBottom, rightBottom, 0.01);
            if (this.snake.anyInside(line2)) {
                continue;
            }
            const line3 = interpolate(rightBottom, rightTop, 0.01);
            if (this.snake.anyInside(line3)) {
                continue;
            }
            const center = new Point2D((rightBottom.x + leftBottom.x) / 2, (leftTop.y + leftBottom.y) / 2);
            this.food.respawn(center);
            return true;
        }
        return false;
    }

    respawnFoodBruteForce(safetyMarginFactor: number): boolean {
        for (let row = safetyMarginFactor * this.foodRadius; row < this.fieldSize - (safetyMarginFactor * this.foodRadius); row++) {
            for (let col = safetyMarginFactor * this.foodRadius; col < this.fieldSize - (safetyMarginFactor * this.foodRadius); col++) {
                const leftBottom = new Point2D(row, col);
                const leftTop = new Point2D(row, col + this.foodRadius);
                const rightBottom = new Point2D(row + this.foodRadius, col);
                const rightTop = new Point2D(row + this.foodRadius, col + this.foodRadius);
                const line0 = interpolate(leftBottom, leftTop, 0.01);
                if (this.snake.anyInside(line0)) {
                    continue;
                }
                const line1 = interpolate(leftTop, rightTop, 0.01);
                if (this.snake.anyInside(line1)) {
                    continue;
                }
                const line2 = interpolate(leftBottom, rightBottom, 0.01);
                if (this.snake.anyInside(line2)) {
                    continue;
                }
                const line3 = interpolate(rightBottom, rightTop, 0.01);
                if (this.snake.anyInside(line3)) {
                    continue;
                }
                const center = new Point2D((rightBottom.x + leftBottom.x) / 2, (leftTop.y + leftBottom.y) / 2);
                this.food.respawn(center);
                return true;
            }
        }
        return false;
    }

    respawnFood() {
        const safetyMarginFactor = 3;
        if (this.respawnFoodRandomly(100, safetyMarginFactor)) {
            return;
        }
        if (this.respawnFoodBruteForce(safetyMarginFactor)) {
            return;
        }
        // Entire game filled, game over.
        this.snake.stopped = true;
        this.endGame();
    }

    update(): void {
        if (this.player.movesLeft()) {
            this.snake.changeDirection(7.5);
        } else if (this.player.movesRight()) {
            this.snake.changeDirection(-7.5);
        }
        this.snake.update();
        const snakeHead = this.snake.getHeadPoints();
        if (this.snake.hitItself() || this.outsideGame.inside(snakeHead)) {
            this.snake.stopped = true;
            this.endGame();
        }
        if (this.food.anyInside(snakeHead)) {
            this.score++;
            if (this.onScoreChanged) {
                this.onScoreChanged(this.score);
            }
            this.snake.increaseBodyLength(50);
            this.respawnFood();
        }
        this.food.update();
    }

    draw(lagFix: number): void {
        this.viewMatrix.setValues([this.fieldSize / 2, this.fieldSize / 2, 5], [this.fieldSize / 2, this.fieldSize / 2, 0], [0, 1, 0]);
        this.projection.setValues(-this.fieldSize / 2, this.fieldSize / 2, -this.fieldSize / 2, this.fieldSize / 2, 4, 6);
        this.snake.draw(lagFix);
        const snakeHead = this.snake.getHeadPoints();
        if (this.snake.hitItself() || this.outsideGame.inside(snakeHead)) {
            this.snake.stopped = true;
            this.endGame();
        }
        if (this.food.anyInside(snakeHead)) {
            this.score++;
            if (this.onScoreChanged) {
                this.onScoreChanged(this.score);
            }
            this.snake.increaseBodyLength(50);
            this.respawnFood();
        }
        this.food.draw(lagFix);
    }

    private endGame() {
        if (!this.onGameDone) {
            return;
        }
        this.onGameDone();
    }

    registerOnScoreChanged(callback: (newScore: number) => void) {
        this.onScoreChanged = callback;
    }

    registerOnGameDone(callback: () => void) {
        this.onGameDone = callback;
    }
}