import { Board } from "./Board";
import { Cell } from "./Cell";
import ColorPalette from "./ColorPalette";
import { ISceneObject } from "./ISceneObject";

export class Food {
    private currentCell: Cell;

    constructor(readonly board: Board) {
    }

    respawn(): boolean {
        this.currentCell = this.board.findRandomFreeCell();
        if (this.currentCell === null) {
            return false;
        }
        this.currentCell.occupy(ColorPalette.YELLOW);
        return true;
    }
}