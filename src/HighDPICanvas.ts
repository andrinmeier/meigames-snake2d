export class HighDPICanvas {
    private currentDevicePixelRatio: number;
    private context: any;
    private readonly resizeObserver: ResizeObserver;
    private readonly canvasToDisplaySizeMap: Map<any, number[]>;
    private readonly baseSize: number = 256;
    private highDPIenabled: boolean = true;

    constructor(readonly canvas: any) {
        this.canvasToDisplaySizeMap = new Map([[canvas, [canvas.clientWidth, canvas.clientHeight]]]);
        this.resizeObserver = new ResizeObserver((entries: any[]) => this.onResize(entries));
        try {
            // only call us of the number of device pixels changed
            this.resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
        } catch (ex) {
            // device-pixel-content-box is not supported so fallback to this
            this.resizeObserver.observe(canvas, { box: 'content-box' });
        }
        this.context = this.canvas.getContext("webgl2");
        this.recalculate();
    }

    disableHighDPI(): void {
        this.highDPIenabled = false;
    }

    cleanup() {
        this.resizeObserver.disconnect();
    }

    onResize(entries: any[]) {
        this.highDPIenabled = true;
        for (const entry of entries) {
            let width;
            let height;
            let dpr = window.devicePixelRatio;
            if (entry.devicePixelContentBoxSize) {
                // NOTE: Only this path gives the correct answer
                // The other paths are imperfect fallbacks
                // for browsers that don't provide anyway to do this
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1; // it's already in width and height
            } else if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                } else {
                    width = entry.contentBoxSize.inlineSize;
                    height = entry.contentBoxSize.blockSize;
                }
            } else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            const displayWidth = Math.round(width * dpr);
            const displayHeight = Math.round(height * dpr);
            this.canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    }

    recalculate() {
        const [widthPixels, heightPixels] = this.canvasToDisplaySizeMap.get(this.canvas);
        const ratio = window.devicePixelRatio;
        const sameRatio = this.currentDevicePixelRatio && ratio === this.currentDevicePixelRatio;
        let resizedWidth;
        let resizedHeight;
        if (this.highDPIenabled) {
            resizedWidth = Math.round(widthPixels * ratio);
            resizedHeight = Math.round(heightPixels * ratio);
        } else {
            resizedWidth = widthPixels;
            resizedHeight = heightPixels;
        }
        const sameWidth = this.canvas.width === resizedWidth;
        const sameHeight = this.canvas.height === resizedHeight;
        if (sameRatio && sameWidth && sameHeight) {
            return;
        }
        this.currentDevicePixelRatio = ratio;
        this.canvas.width = resizedWidth;
        this.canvas.height = resizedHeight;
        this.context.viewport(0, 0, this.context.drawingBufferWidth, this.context.drawingBufferHeight);
    }

    getLogicalWidth() {
        if (this.getCanvasWidth() <= this.getCanvasHeight()) {
            return this.baseSize;
        } else {
            const ratio = this.getCanvasWidth() / this.getCanvasHeight();
            return this.baseSize * ratio;
        }
    }

    getLogicalHeight() {
        if (this.getCanvasHeight() <= this.getCanvasWidth()) {
            return this.baseSize;
        } else {
            const ratio = this.getCanvasHeight() / this.getCanvasWidth();
            return this.baseSize * ratio;
        }
    }

    getSmallestCanvasLength() {
        const widthHeight = this.canvasToDisplaySizeMap.get(this.canvas);
        return Math.min(widthHeight[0], widthHeight[1]);
    }

    getCanvasWidth() {
        return this.canvasToDisplaySizeMap.get(this.canvas)[0];
    }

    getCanvasHeight() {
        return this.canvasToDisplaySizeMap.get(this.canvas)[1];
    }
}