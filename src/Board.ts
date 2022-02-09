import { Cell } from "./Cell";
import { BoardPosition } from "./BoardPosition";
import randomValue from "./RandomValue";
import { ISceneObject } from "./ISceneObject";
import { ScenePosition } from "./ScenePosition";
import { SceneColor } from "./SceneColor";
import { ModelMatrix } from "./ModelMatrix";

export class Board implements ISceneObject {
    readonly cells: Cell[];

    constructor(context: any, shaderProgram: any, numberOfCells: number, boardSize: number) {
        const cellSize = boardSize / numberOfCells;
        for (let row = 0; row < numberOfCells; row++) {
            for (let col = 0; col < numberOfCells; col++) {
                this.cells.push(new Cell(
                    cellSize,
                    new BoardPosition(row, col),
                    new ScenePosition(context, shaderProgram),
                    new SceneColor(context, shaderProgram),
                    new ModelMatrix(context, shaderProgram)));
            }
        }
    }

    findRandomFreeCell() {
        const freeCells = this.cells.filter(cell => cell.isFree());
        if (freeCells.length === 0) {
            return null;
        }
        const randomCellIndex = randomValue(0, freeCells.length - 1);
        return freeCells[randomCellIndex];
    }

    getCellAbove(position: BoardPosition): Cell {
        const target = this.cells.filter(cell => cell.position.isDirectlyAbove(position));
        if (target.length === 0) {
            return null;
        }
        return target[0];
    }

    getCellBelow(position: BoardPosition): Cell {
        const target = this.cells.filter(cell => cell.position.isDirectlyBelow(position));
        if (target.length === 0) {
            return null;
        }
        return target[0];
    }

    getCellLeft(position: BoardPosition): Cell {
        const target = this.cells.filter(cell => cell.position.isDirectlyLeft(position));
        if (target.length === 0) {
            return null;
        }
        return target[0];
    }

    getCellRight(position: BoardPosition): Cell {
        const target = this.cells.filter(cell => cell.position.isDirectlyRight(position));
        if (target.length === 0) {
            return null;
        }
        return target[0];
    }

    update(): void {
        this.cells.forEach(cell => cell.update());
    }

    draw(lagFix: number): void {
        this.cells.forEach(cell => cell.draw(lagFix));
    }
}