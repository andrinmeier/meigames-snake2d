import { median } from './Math';

export class FPSRecorder {
    private fpsRecorder: number[] = [];
    private recordLastN: number = 25;
    private lastFPS: number;
    private lowerThanThisIsLowFPS: number = 50;
    private currentlyLowFPS: boolean = false;
    private onLowFPSDetected: () => void;

    record(msPerFrame: number): void {
        const delta = msPerFrame / 1000;
        const fps = 1 / delta;
        this.fpsRecorder.push(fps);
        this.fpsRecorder = this.fpsRecorder.slice(Math.max(this.fpsRecorder.length - this.recordLastN, 0));
        this.lastFPS = median(this.fpsRecorder);
        this.checkLowFPS();
    }

    hasLowFPS() {
        return this.lastFPS < this.lowerThanThisIsLowFPS;
    }

    hasEnoughData(): boolean {
        return this.fpsRecorder.length >= this.recordLastN;
    }

    private checkLowFPS(): void {
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
}