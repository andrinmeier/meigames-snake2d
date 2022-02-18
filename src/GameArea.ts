import { BoundingBox } from "./BoundingBox";
import { Point2D } from "./Point2D";

export class GameArea {
    private boxes: BoundingBox[];

    constructor(private width: number, private height: number, private readonly squareLength: number) {
        this.createSquares();
    }

    resize(width: number, height: number): void {
        if (this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            this.createSquares();
        }
    }

    getFreeSquares(occupied: BoundingBox[]): BoundingBox[] {
        return this.boxes.filter(box => !occupied.some(occ => box.overlaps(occ)));
    }

    createSquares(): void {
        const boxes = [];
        for (let row = 25; row <= (this.height - this.squareLength - 25); row += this.squareLength) {
            for (let col = 25; col <= (this.width - this.squareLength - 25); col += this.squareLength) {
                boxes.push(new BoundingBox(
                    new Point2D(col, row),
                    new Point2D(col, row + this.squareLength),
                    new Point2D(col + this.squareLength, row),
                    new Point2D(col + this.squareLength, row + this.squareLength)
                ));
            }
        }
        this.boxes = boxes;
    }
}