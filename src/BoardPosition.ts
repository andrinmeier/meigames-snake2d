export class BoardPosition {
    constructor(readonly x: number, readonly y: number) {}

    isDirectlyAbove(other: BoardPosition) {
        return this.x === other.x && this.y === other.y + 1;
    }

    isDirectlyBelow(other: BoardPosition) {
        return this.x === other.x && this.y === other.y - 1;
    }

    isDirectlyLeft(other: BoardPosition) {
        return this.x === other.x - 1 && this.y === other.y;
    }

    isDirectlyRight(other: BoardPosition) {
        return this.x === other.x + 1 && this.y === other.y;
    }
}