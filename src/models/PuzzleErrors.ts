import { CellPosition } from "./Cell"

export interface PuzzleErrors {
    cellErrors: CellPosition[],
    seenClueErrors: SeenClueError[]
}

export interface SeenClueError {
    location: 'top' | 'bottom' | 'left' | 'right',
    index: number
}

export const removeErrorsForCellPosition = (puzzleErrors: PuzzleErrors, cells: CellPosition[]): PuzzleErrors => {
  const newCellErrors = puzzleErrors.cellErrors.filter(errorCell => 
    !cells.some(cell => cell.x === errorCell.x || cell.y === errorCell.y)
  );

  const isTopOrBottom = (location: string) => location === 'top' || location === 'bottom';
  const isLeftOrRight = (location: string) => location === 'left' || location === 'right';

  const newSeenClueErrors = puzzleErrors.seenClueErrors.filter(seenClue => 
    !cells.some(cell => 
      (isTopOrBottom(seenClue.location) && seenClue.index === cell.x) || 
      (isLeftOrRight(seenClue.location) && seenClue.index === cell.y)
    )
  );

  return {
    cellErrors: newCellErrors,
    seenClueErrors: newSeenClueErrors,
  }
}

export const combinePuzzleErrors = (errors1: PuzzleErrors, errors2: PuzzleErrors): PuzzleErrors => {
    const combinedCellErrors = [...errors1.cellErrors, ...errors2.cellErrors];
    const combinedSeenClueErrors = [...errors1.seenClueErrors, ...errors2.seenClueErrors];
  
    return {
      cellErrors: combinedCellErrors,
      seenClueErrors: combinedSeenClueErrors,
    }
  }