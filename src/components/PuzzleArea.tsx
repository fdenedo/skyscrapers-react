import React from "react";
import { useState } from "react";
import SeenClueContainer from "./SeenClueContainer";
import Grid from "./Grid";
import { Puzzle, checkColumnForDuplicates, checkRowForDuplicates, getSeenClueErrors, isPuzzleComplete } from "../models/Puzzle";
import './PuzzleArea.css'
import { CellPosition } from "../models/Cell";
import { PuzzleErrors, SeenClueError, combinePuzzleErrors, removeErrorsForCellPosition } from "../models/PuzzleErrors";

interface PuzzleAreaProps {
    puzzle: Puzzle
}

const PuzzleArea: React.FC<PuzzleAreaProps> = ({
    puzzle
}) => {
    const [puzzleState, setPuzzleState] = useState(puzzle);
    const [puzzleErrors, setPuzzleErrors] = useState<PuzzleErrors>({cellErrors: [], seenClueErrors: []});

    const checkCellsForErrors = (puzzleState: Puzzle, cells: CellPosition[]) => {
        console.log(`Checking ${cells.length} cells for errors: `, cells.map(c => `(${c.x}, ${c.y})`))
        console.log('Puzzle State: ', puzzleState)

        const checkedRows = new Set<number>();
        const checkedCols = new Set<number>();

        const cellErrors: CellPosition[] = [];
        const seenClueErrors: SeenClueError[] = [];

        console.log('checkCellsForErrors: entering for loop')

        cells.forEach(cell => {
            let loop = 1;
            console.log(`Loop ${loop++}`)

            console.log(`Rows checked: `, checkedRows)
            console.log(`Cols checked: `, checkedCols)

            if(!checkedRows.has(cell.y)) {
                console.log(`Checking row ${cell.y}`)
                const dupesInRow: CellPosition[] = checkRowForDuplicates(puzzleState, cell.y);
                const seenClueErrorsInRow: SeenClueError[] = getSeenClueErrors(puzzleState, 'row', cell.y)
                
                cellErrors.push(...dupesInRow);
                seenClueErrors.push(...seenClueErrorsInRow);
                checkedRows.add(cell.y);
            }

            if(!checkedCols.has(cell.x)) {
                console.log(`Checking column ${cell.y}`)
                const dupesInColumn: CellPosition[] = checkColumnForDuplicates(puzzleState, cell.x);
                const seenClueErrorsInColumn: SeenClueError[] = getSeenClueErrors(puzzleState, 'col', cell.x)

                cellErrors.push(...dupesInColumn);
                seenClueErrors.push(...seenClueErrorsInColumn);
                checkedCols.add(cell.x);
            }
        })

        const allErrors: PuzzleErrors = {
            cellErrors,
            seenClueErrors
        }

        console.log(`${allErrors.cellErrors.length} cell errors and ${allErrors.seenClueErrors.length} seen clue errors: `, allErrors);
        return allErrors;
    }

    const checkForPuzzleSolved = (currentPuzzleState: Puzzle, currentPuzzleErrors: PuzzleErrors) => {
        if (isPuzzleComplete(currentPuzzleState.grid)) {
          if (currentPuzzleErrors.cellErrors.length === 0 && currentPuzzleErrors.seenClueErrors.length === 0) {
            console.log("Puzzle is complete!");
          } else {
            console.log("Puzzle is filled but has errors.");
          }
        }
      }; 

    const handleCellValueChange = (cellsChanged: CellPosition[], newGridValues: (number | null)[][]) => {
        const gridWithZeros = newGridValues.map(row => {
            return row.map(cell => (cell === null ? 0 : cell));
        });

        const newPuzzleState = { ...puzzleState, grid: gridWithZeros };
        const prevErrorsWithNewChecksRemoved = removeErrorsForCellPosition(puzzleErrors, cellsChanged)
        const newErrors = checkCellsForErrors(newPuzzleState, cellsChanged);

        const allErrors = combinePuzzleErrors(prevErrorsWithNewChecksRemoved, newErrors);

        console.log(`All errors`, allErrors);

        setPuzzleState(newPuzzleState);
        setPuzzleErrors(allErrors);
        checkForPuzzleSolved(newPuzzleState, allErrors);

        console.log(`${cellsChanged.length} cells changed: `, cellsChanged);
    }

    const calculateCellSizeInPx = (size: number) => {
        if (size === 3) return 64;
        if (size === 4) return 56;
        return 48;
    }
    
    const cellSize = `${calculateCellSizeInPx(puzzle.size.rows)}px`;
    
    const style: React.CSSProperties = {
        '--cell-size': cellSize
    } as React.CSSProperties;

    return (
        <div className="game">
            <div className="puzzle-area" style={style}>
                <div className="puzzle-area-top">
                    <SeenClueContainer position='top' clues={puzzle.clues.top} errors={puzzleErrors.seenClueErrors} />
                </div>
                <div className="puzzle-area-middle">
                    <SeenClueContainer position='left' clues={puzzle.clues.left} errors={puzzleErrors.seenClueErrors} />
                    <Grid 
                        xSize={puzzle.size.columns} 
                        ySize={puzzle.size.rows} 
                        givenDigits={puzzle.grid}
                        errors={puzzleErrors.cellErrors} 
                        onCellChange={handleCellValueChange} 
                    />
                    <SeenClueContainer position='right' clues={puzzle.clues.right} errors={puzzleErrors.seenClueErrors} />
                </div>
                <div className="puzzle-area-bottom">
                    <SeenClueContainer position='bottom' clues={puzzle.clues.bottom} errors={puzzleErrors.seenClueErrors} />
                </div>
            </div>
        </div>
        
    );
}

export default PuzzleArea;
