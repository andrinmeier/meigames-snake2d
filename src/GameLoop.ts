import { Scene } from "./Scene";

export class GameLoop {
    private readonly MS_PER_UPDATE: number = 16.6;
    private previous: number = 0;
    private lag: number = 0.0;
    private stopped: boolean = false;

    constructor(readonly context: any, readonly scene: Scene) { }

    init() {
        this.context.clearColor(225 / 255, 225 / 255, 225 / 255, 1);
    }

    drawAnimated = (current) => {
        if (this.stopped) {
            return;
        }
        const oldPrevious = this.previous;
        const elapsed = current - this.previous;
        this.previous = current;
        if (oldPrevious > 0) {
            this.lag += elapsed;
            while (this.lag >= this.MS_PER_UPDATE) {
                this.scene.update();
                this.lag -= this.MS_PER_UPDATE;
            }
            this.context.clear(this.context.COLOR_BUFFER_BIT);
            const restLag = this.lag / this.MS_PER_UPDATE;
            this.scene.draw(restLag);
        }
        window.requestAnimationFrame(this.drawAnimated);
    }

    start() {
        this.stopped = false;
        window.requestAnimationFrame(this.drawAnimated);
    }

    stop() {
        this.stopped = true;
    }
}