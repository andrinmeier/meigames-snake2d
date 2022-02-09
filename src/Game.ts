import { Board } from "./Board";
import { GameLoop } from "./GameLoop";
import { Scene } from "./Scene";
import { loadAndCompileShaders } from "./ShaderUtils";
import { SnakeGame } from "./SnakeGame";

export class Game {
    private onScoreChangedCallback: (newScore: number) => void;
    private onGameDoneCallback: () => void;
    private loop: GameLoop;
    private snakeGame: SnakeGame;

    constructor(readonly context: any) {
    }

    async init() {
        const shaderProgram = await loadAndCompileShaders(
            this.context,
            "./shaders/vertex_shader.glsl",
            "./shaders/fragment_shader.glsl"
        );
        const width = this.context.drawingBufferWidth;
        const board = new Board(this.context, shaderProgram, Math.sqrt(width), width);
        this.snakeGame = new SnakeGame(board);
        const scene = new Scene();
        scene.add(this.snakeGame);
        scene.add(board);
        this.loop = new GameLoop(this.context, scene);
        this.snakeGame.onScoreChanged((newScore: number) => this.onScoreChangedCallback(newScore));
        this.snakeGame.onGameDone(() => this.onGameDoneCallback());
        await this.loop.init();
    }

    start() {
        this.loop.start();
    }

    onScoreChanged(callback: (newScore: number) => void) {
        this.onScoreChangedCallback = callback;
    }

    onGameDone(callback: () => void) {
        this.loop.stop();
        this.onGameDoneCallback = callback;
    }
}