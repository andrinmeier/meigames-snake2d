import { Angle } from "./Angle";
import { atan3, normalize } from "./Math";
import { GamePoint2D } from "./GamePoint2D";
import { ScreenPoint2D } from "./ScreenPoint2D";
import { Vector2D } from "./Vector2D";

export class MobilePlayer {
    private firstPoint: ScreenPoint2D;
    private lastPoint: ScreenPoint2D;

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
        this.firstPoint = new GamePoint2D(x, y);
    };

    recordMove = (event) => {
        if (event.target !== this.target) {
            return;
        }
        const x = event.changedTouches[0].screenX;
        const y = event.changedTouches[0].screenY;
        this.lastPoint = new GamePoint2D(x, y);
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
        const localX = this.lastPoint.x - origin.x;
        // Screen coordinates start with Y top to bottom
        const localY = origin.y - this.lastPoint.y;
        const normalized = normalize(new Vector2D(localX, localY));
        return atan3(normalized.y, normalized.x);
    }
}
