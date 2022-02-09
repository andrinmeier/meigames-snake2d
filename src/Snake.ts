import { Board } from "./Board";
import { Cell } from "./Cell";
import { Player } from "./Player";
import { PlayerDirection } from "./PlayerDirection";

export class Snake {
    private readonly body: Cell[];
    private readonly player: Player = new Player();
    private direction: PlayerDirection;
    private collided: boolean = false;
    private eatenFood: boolean = false;

    constructor(private readonly board: Board, initialLength: number) {
        this.direction = PlayerDirection.Up;
        this.body.push(this.board.findRandomFreeCell());
        this.grow(initialLength - 1);
    }

    private grow(length: number) {
        const current = length;
        while (current > 0) {
            const nextCell = this.findNextCellByDirection();
            if (nextCell === null) {
                return;
            }
            this.body.push(nextCell);
        }
    }

    hasEatenFood(): boolean {
        return this.eatenFood;
    }

    hasCollided(): boolean {
        return this.collided;
    }

    private getHead(): Cell {
        if (this.body.length === 0) {
            return null;
        }
        return this.body[this.body.length - 1];
    }

    private prune(): void {
        if (this.body.length === 0) {
            return;
        }
        this.body.splice(0, 1);
    }

    move() {
        const nextCell = this.getNextCell();
        if (nextCell === null) {
            return;
        }
        this.collided = this.hasCollided();
        if (!this.hasCollided()) {
            this.grow(1);
            this.prune();
        }
        this.eatenFood = this.foundFood(nextCell);
        if (this.hasEatenFood()) {
            this.grow(1);
        }
    }

    private getNextCell(): Cell | null {
        if (this.player.movesUp()) {
            this.direction = PlayerDirection.Up;
        } else if (this.player.movesDown()) {
            this.direction = PlayerDirection.Down;
        } else if (this.player.movesLeft()) {
            this.direction = PlayerDirection.Left;
        } else if (this.player.movesRight()) {
            this.direction = PlayerDirection.Right;
        }
        return this.findNextCellByDirection();
    }

    private findNextCellByDirection(): Cell | null {
        if (this.direction === PlayerDirection.Up) {
            return this.board.getCellAbove(this.getHead().position);
        } else if (this.direction === PlayerDirection.Down) {
            return this.board.getCellBelow(this.getHead().position);
        } else if (this.direction === PlayerDirection.Left) {
            return this.board.getCellLeft(this.getHead().position);
        } else if (this.direction === PlayerDirection.Right) {
            return this.board.getCellRight(this.getHead().position);
        }
        return null;
    }

    private foundFood(cell: Cell) {
        return !cell.isFree() && !this.isPartOfBody(cell);
    }

    private checkCollisions(cell: Cell) {
        return this.isPartOfBody(cell) || this.collidedWithWall(cell);
    }

    private isPartOfBody(cell: Cell) {
        return this.body.some(bodyCell => bodyCell === cell);
    }

    private collidedWithWall(cell: Cell) {
        return cell === null;
    }
}