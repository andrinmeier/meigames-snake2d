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

    getSwipeAngleAndConsume(headPoint: Point2D): Angle {
        const startVec = new Point2D(this.startPoint.x - headPoint.x, this.startPoint.y - headPoint.y);
        const normalizedStart = Math.sqrt(Math.pow(startVec.x, 2) + Math.pow(startVec.y, 2));
        const startNormal = new Point2D(startVec.x / normalizedStart, startVec.y / normalizedStart);
        const endVec = new Point2D(this.endPoint.x - headPoint.x, this.endPoint.y - headPoint.y);
        const normalizedEnd = Math.sqrt(Math.pow(endVec.x, 2) + Math.pow(endVec.y, 2));
        const endNormal = new Point2D(endVec.x / normalizedEnd, endVec.y / normalizedEnd);
        const cosPhi = startNormal.x * endNormal.x + startNormal.y * endNormal.y;
        delete this.startPoint;
        delete this.endPoint;
        return Angle.fromRad(Math.acos(cosPhi));
    }
}
