import { Food } from "./Food";
import { GameArea } from "./GameArea";
import { ISceneObject } from "./ISceneObject";
import { OrthographicProjection } from "./OrthographicProjection";
import { OutsideGameArea } from "./OutsideGameArea";
import { DesktopPlayer } from "./DesktopPlayer";
import randomValue from "./RandomValue";
import { HighDPICanvas } from "./HighDPICanvas";
import { Snake } from "./Snake";
import { ViewMatrix } from "./ViewMatrix";
import { MobilePlayer } from "./MobilePlayer";
import { GamePoint2D } from "./GamePoint2D";
import { Circle } from "./Circle";
import { ModelMatrix } from "./ModelMatrix";
import { ObjectPosition } from "./ObjectPosition";
import { ObjectColor } from "./ObjectColor";

export class SnakeGame implements ISceneObject {
    private onScoreChanged: (newScore: number) => void;
    private onGameDone: () => void;
    private score: number = 0;
    private snake: Snake;
    private food: Food;
    private readonly desktopPlayer: DesktopPlayer;
    private readonly mobilePlayer: MobilePlayer;
    private readonly viewMatrix: ViewMatrix;
    private readonly projection: OrthographicProjection;
    private readonly outsideGame: OutsideGameArea;
    private readonly highDPICanvas: HighDPICanvas;
    private readonly gameArea: GameArea;

    constructor(context: any, shaderProgram: any, private readonly canvas: any) {
        this.viewMatrix = new ViewMatrix(context, shaderProgram);
        this.projection = new OrthographicProjection(context, shaderProgram);
        this.highDPICanvas = new HighDPICanvas(this.canvas);
        const initialFoodRadius = 5;
        this.gameArea = new GameArea(this.highDPICanvas.getLogicalWidth(), this.highDPICanvas.getLogicalHeight(), 8 * initialFoodRadius);
        this.outsideGame = new OutsideGameArea(this.highDPICanvas.getLogicalWidth(), this.highDPICanvas.getLogicalHeight());
        this.desktopPlayer = new DesktopPlayer();
        this.mobilePlayer = new MobilePlayer(canvas);
        this.snake = new Snake(context, shaderProgram, 5, 0.4);
        this.snake.restrictBodyLength(50);
        this.snake.grow(50);
        const circle = new Circle(
            context, 
            new ObjectPosition(context, shaderProgram),
            new ObjectColor(context, shaderProgram),
            new ModelMatrix(context, shaderProgram));
        this.food = new Food(initialFoodRadius, circle);
        this.respawnFood();
    }

    switchToLowerQuality(): void {
        this.highDPICanvas.disableHighDPI();
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

    cleanup() {
        this.desktopPlayer.cleanup();
        this.mobilePlayer.cleanup();
        this.highDPICanvas.cleanup();
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
        this.highDPICanvas.recalculate();
        this.gameArea.resize(this.highDPICanvas.getLogicalWidth(), this.highDPICanvas.getLogicalHeight());
        this.outsideGame.resize(this.highDPICanvas.getLogicalWidth(), this.highDPICanvas.getLogicalHeight());
        if (this.desktopPlayer.movesLeft()) {
            this.snake.changeDirection(7.5);
        } else if (this.desktopPlayer.movesRight()) {
            this.snake.changeDirection(-7.5);
        }
        if (this.mobilePlayer.swipeHappened()) {
            const angle = this.mobilePlayer.getSwipeAngle();
            this.snake.approximateDirection(angle.degrees);
        }
        this.snake.update();
        const snakeHead = this.snake.getHeadPoints();
        this.checkForCollisions(snakeHead);
        this.checkForEatenFood(snakeHead);
    }

    private checkForCollisions(snakeHead: GamePoint2D[]): void {
        if (this.snake.hitItself() || this.outsideGame.inside(snakeHead)) {
            this.snake.stopped = true;
            this.endGame();
        }
    }

    private checkForEatenFood(snakeHead: GamePoint2D[]): void {
        if (this.food.anyPointsInside(snakeHead)) {
            this.score++;
            if (this.onScoreChanged) {
                this.onScoreChanged(this.score);
            }
            this.snake.increaseBodyLength(50);
            this.respawnFood();
            this.snake.speedUp();
        }
    }

    draw(lagFix: number): void {
        this.highDPICanvas.recalculate();
        this.gameArea.resize(this.highDPICanvas.getLogicalWidth(), this.highDPICanvas.getLogicalHeight());
        this.outsideGame.resize(this.highDPICanvas.getLogicalWidth(), this.highDPICanvas.getLogicalHeight());
        this.setCamera();
        this.snake.draw(lagFix);
        const snakeHead = this.snake.getHeadPoints();
        this.checkForCollisions(snakeHead);
        this.checkForEatenFood(snakeHead);
        this.food.draw(lagFix);
    }

    private setCamera() {
        const width = this.highDPICanvas.getLogicalWidth();
        const height = this.highDPICanvas.getLogicalHeight();
        this.viewMatrix.setValues([width / 2, height / 2, 5], [width / 2, height / 2, 0], [0, 1, 0]);
        this.projection.setValues(-width / 2, width / 2, -height / 2, height / 2, 4, 6);
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