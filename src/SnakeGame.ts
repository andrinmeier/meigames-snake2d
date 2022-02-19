import { BoundingBox } from "./BoundingBox";
import { Food } from "./Food";
import { GameArea } from "./GameArea";
import { ISceneObject } from "./ISceneObject";
import interpolate from "./LinearInterpolation";
import { ModelMatrix } from "./ModelMatrix";
import { OrthographicProjection } from "./OrthographicProjection";
import { OutsideGameArea } from "./OutsideGameArea";
import { DesktopPlayer } from "./DesktopPlayer";
import { Point2D } from "./Point2D";
import randomValue from "./RandomValue";
import { SceneColor } from "./SceneColor";
import { ScenePosition } from "./ScenePosition";
import { SmoothCanvas } from "./SmoothCanvas";
import { Snake } from "./Snake";
import { Square } from "./Square";
import { ViewMatrix } from "./ViewMatrix";
import { MobilePlayer } from "./MobilePlayer";

export class SnakeGame implements ISceneObject {
    private onScoreChanged: (newScore: number) => void;
    private onGameDone: () => void;
    private score: number = 0;
    private snake: Snake;
    private food: Food;
    private readonly desktopPlayer: DesktopPlayer;
    private readonly mobilePlayer: MobilePlayer;
    private readonly foodRadius: number = 5;
    private readonly viewMatrix: ViewMatrix;
    private readonly projection: OrthographicProjection;
    private readonly outsideGame: OutsideGameArea;
    private readonly smoothCanvas: SmoothCanvas;
    private readonly gameArea: GameArea;

    constructor(private readonly context: any, private readonly shaderProgram: any, private readonly canvas: any) {
        this.viewMatrix = new ViewMatrix(context, shaderProgram);
        this.projection = new OrthographicProjection(context, shaderProgram);
        this.smoothCanvas = new SmoothCanvas(this.canvas);
        this.gameArea = new GameArea(this.smoothCanvas.getLogicalWidth(), this.smoothCanvas.getLogicalHeight(), 8 * this.foodRadius);
        this.outsideGame = new OutsideGameArea(this.smoothCanvas.getLogicalWidth(), this.smoothCanvas.getLogicalHeight());
        this.desktopPlayer = new DesktopPlayer();
        this.mobilePlayer = new MobilePlayer();
        this.snake = new Snake(context, shaderProgram);
        this.snake.restrictBodyLength(50);
        this.snake.grow(200);
        this.food = new Food(this.foodRadius, context, shaderProgram);
        this.respawnFood();
    }

    private respawnFoodRandomly(): boolean {
        const snakeBoxes = this.snake.getHitBoxes();
        const freeSquares = this.gameArea.getFreeSquares(snakeBoxes);
        if (freeSquares.length === 0) {
            return false;
        }
        const freeBoxIndex = randomValue(0, freeSquares.length - 1);
        const freeBox = freeSquares[freeBoxIndex];
        this.food.respawn(freeBox.getCenter());
        return true;
    }


    respawnFood() {
        if (this.respawnFoodRandomly()) {
            return;
        }
        // Entire game filled, game over.
        this.snake.stopped = true;
        this.endGame();
    }

    update(): void {
        this.smoothCanvas.recalculate();
        this.gameArea.resize(this.smoothCanvas.getLogicalWidth(), this.smoothCanvas.getLogicalHeight());
        this.outsideGame.resize(this.smoothCanvas.getLogicalWidth(), this.smoothCanvas.getLogicalHeight());
        if (this.desktopPlayer.movesLeft()) {
            this.snake.changeDirection(7.5);
        } else if (this.desktopPlayer.movesRight()) {
            this.snake.changeDirection(-7.5);
        }
        if (this.mobilePlayer.swipeHappened()) {
            if (this.mobilePlayer.swipedLeft()) {
                this.snake.changeDirection(30);
            } else if (this.mobilePlayer.swipedRight()) {
                this.snake.changeDirection(-30);
            }
            this.mobilePlayer.consume();
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
            this.snake.speedUp();
        }
        this.food.update();
    }

    draw(lagFix: number): void {
        this.smoothCanvas.recalculate();
        this.gameArea.resize(this.smoothCanvas.getLogicalWidth(), this.smoothCanvas.getLogicalHeight());
        this.outsideGame.resize(this.smoothCanvas.getLogicalWidth(), this.smoothCanvas.getLogicalHeight());
        const width = this.smoothCanvas.getLogicalWidth();
        const height = this.smoothCanvas.getLogicalHeight();
        this.viewMatrix.setValues([width / 2, height / 2, 5], [width / 2, height / 2, 0], [0, 1, 0]);
        this.projection.setValues(-width / 2, width / 2, -height / 2, height / 2, 4, 6);
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