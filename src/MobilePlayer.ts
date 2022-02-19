import { Angle } from "./Angle";
import { Point2D } from "./Point2D";

export class MobilePlayer {
    private firstPoint: Point2D;
    private lastPoint: Point2D;

    constructor(private readonly target: any) {
        this.hookupEventListeners();
    }

    hookupEventListeners() {
        window.addEventListener("touchstart", this.recordStart, false);
        window.addEventListener("touchmove", this.recordMove, false);
        window.addEventListener("touchcancel", this.recordEnd, false);
        window.addEventListener("touchend", this.recordEnd, false);
    }

    cleanup() {
        window.addEventListener("touchstart", this.recordStart, false);
        window.removeEventListener("touchmove", this.recordMove, false);
        window.removeEventListener("touchcancel", this.recordEnd, false);
        window.removeEventListener("touchend", this.recordEnd, false);
    }

    recordStart = (event) => {
        if (event.target !== this.target) {
            return;
        }
        const x = event.changedTouches[0].screenX;
        const y = event.changedTouches[0].screenY;
        this.firstPoint = new Point2D(x, y);
    };

    recordMove = (event) => {
        if (event.target !== this.target) {
            return;
        }
        const x = event.changedTouches[0].screenX;
        const y = event.changedTouches[0].screenY;
        this.lastPoint = new Point2D(x, y);
    };

    recordEnd = (event) => {
        if (event.target !== this.target) {
            return;
        }
        delete this.firstPoint;
        delete this.lastPoint;
    };

    swipeHappened(): boolean {
        return this.firstPoint !== undefined && this.lastPoint !== undefined;
    }

    getSwipeAngle(): Angle {
        const origin = this.firstPoint;
        const directionVec = new Point2D(this.lastPoint.x - origin.x, origin.y - this.lastPoint.y);
        const unit = Math.sqrt(Math.pow(directionVec.x, 2) + Math.pow(directionVec.y, 2));
        const normalized = new Point2D(directionVec.x / unit, directionVec.y / unit);
        let deg = Math.atan2(normalized.y, normalized.x) * (180 / Math.PI);
        if (deg < 0) {
            deg += 360;
        }
        return Angle.fromDegrees(deg);
    }
}
