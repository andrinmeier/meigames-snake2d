import { GameLoop } from "./GameLoop";
import { Scene } from "./Scene";
import { loadAndCompileShaders } from "./ShaderUtils";
import { SnakeGame } from "./SnakeGame";

export class Game {
    private onScoreChanged: (newScore: number) => void;
    private onGameDone: () => void;
    private loop: GameLoop;
    private shaderProgram: any;
    private snakeGame: SnakeGame;

    constructor(readonly context: any, readonly canvas: any) {
        this.shaderProgram = loadAndCompileShaders(this.context);
    }

    start() {
        this.init();
        this.loop.start();
    }

    private init() {
        if (this.snakeGame) {
            this.snakeGame.cleanup();
        }
        this.snakeGame = new SnakeGame(this.context, this.shaderProgram, this.canvas);
        const scene = new Scene();
        scene.add(this.snakeGame);
        this.loop = new GameLoop(this.context, scene);
        this.snakeGame.registerOnScoreChanged((newScore: number) => {
            if (!this.onScoreChanged) {
                return;
            }
            this.onScoreChanged(newScore);
        });
        this.snakeGame.registerOnGameDone(() => {
            this.loop.stop();
            if (!this.onGameDone) {
                return;
            }
            this.onGameDone()
        });
        this.loop.init();
    }

    registerOnScoreChanged(callback: (newScore: number) => void) {
        this.onScoreChanged = callback;
    }

    registerOnGameDone(callback: () => void) {
        this.onGameDone = callback;
    }
}