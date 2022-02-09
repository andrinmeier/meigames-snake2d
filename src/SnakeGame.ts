import { Board } from "./Board";
import { Food } from "./Food";
import { ISceneObject } from "./ISceneObject";
import { Snake } from "./Snake";

export class SnakeGame implements ISceneObject {
    private onScoreChangedCallback: (newScore: number) => void;
    private onGameDoneCallback: () => void;
    private score: number = 0;
    private snake: Snake;
    private food: Food;

    constructor(board: Board) {
        this.snake = new Snake(board, 3);
        this.food = new Food(board);
    }

    update(): void {
        this.snake.move();
        if (this.snake.hasCollided) {
            this.onGameDoneCallback();
        }
        if (this.snake.hasEatenFood()) {
            this.score++;
            this.onScoreChangedCallback(this.score);
            if (!this.food.respawn()) {
                this.onGameDoneCallback();
            }
        }
    }

    draw(lagFix: number): void {
    }

    onScoreChanged(callback: (newScore: number) => void) {
        this.onScoreChangedCallback = callback;
    }

    onGameDone(callback: () => void) {
        this.onGameDoneCallback = callback;
    }
}