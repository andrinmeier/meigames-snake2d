export class FPSRecorder {
    private fpsRecorder: number[] = [];
    private recordLastN: number = 50;
    private lastFPS: number;
    private lowerThanThisIsLowFPS: number = 50;
    private currentlyLowFPS: boolean = false;
    private onLowFPSDetected: () => void;

    record(elapsedInMs: number): void {
        const delta = elapsedInMs / 1000;
        const fps = 1 / delta;
        this.fpsRecorder.push(fps);
        this.fpsRecorder = this.fpsRecorder.slice(Math.max(this.fpsRecorder.length - this.recordLastN, 0));
        this.lastFPS = this.median(this.fpsRecorder);
        this.notifyFPSChange();
    }

    hasLowFPS() {
        return this.lastFPS < this.lowerThanThisIsLowFPS;
    }

    hasEnoughData(): boolean {
        return this.fpsRecorder.length >= this.recordLastN;
    }

    private notifyFPSChange(): void {
        if (!this.hasEnoughData()) {
            return;
        }
        if (this.hasLowFPS()) {
            if (!this.currentlyLowFPS) {
                this.currentlyLowFPS = true;
                if (this.onLowFPSDetected) {
                    this.onLowFPSDetected();
                }
            }
        } else {
            if (this.currentlyLowFPS) {
                this.currentlyLowFPS = false;
            }
        }
    }

    registerOnLowFPSDetected(callback: () => void): void {
        this.onLowFPSDetected = callback;
    }

    private median(values: number[]): number {
        const sorted = values.slice().sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }
}