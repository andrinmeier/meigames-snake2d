import { Angle } from "./Angle";
import { Point2D } from "./Point2D";

export class MobilePlayer {
    private startPoint: Point2D;
    private endPoint: Point2D;

    constructor() {
        this.hookupEventListeners();
    }

    hookupEventListeners() {
        window.addEventListener("touchstart", this.recordStart, false);
        window.addEventListener("touchend", this.recordEnd, false);
    }

    recordStart = (event) => {
        delete this.startPoint;
        const x = event.changedTouches[0].screenX;
        const y = event.changedTouches[0].screenY;
        this.startPoint = new Point2D(x, y);
    };

    recordEnd = (event) => {
        const x = event.changedTouches[0].screenX;
        const y = event.changedTouches[0].screenY;
        this.endPoint = new Point2D(x, y);
    };

    swipeHappened(): boolean {
        return this.startPoint !== undefined && this.endPoint !== undefined;
    }

    swipedLeft(): boolean {
        const endVec = new Point2D(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
        return endVec.x < 0;
    }

    swipedRight(): boolean {
        const endVec = new Point2D(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
        return endVec.x > 0;
    }

    consume(): void {
        delete this.startPoint;
        delete this.endPoint;
    }
}
