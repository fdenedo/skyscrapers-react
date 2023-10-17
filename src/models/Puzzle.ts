import { CellPosition } from "./Cell";
import { SeenClueError } from "./PuzzleErrors";

export interface Puzzle {
    id: string;
    size: {
        rows: number;
        columns: number;
    };
    grid: number[][];
    clues: {
        top: number[];
        left: number[];
        right: number[];
        bottom: number[];
    };
}

interface SeenClueWithArray {
    location: 'top' | 'bottom' | 'left' | 'right',
    clueIndex: number,
    clueValue: number,
    arrayFromPuzzle: number[]
}

export const getColumn = (puzzle: Puzzle, index: number) => {
    return puzzle.grid.map(p => p[index]);
}

export const setValueAt = (puzzle: Puzzle, x: number, y: number, value: number) => {
    const newGrid = [...puzzle.grid];
    newGrid[y][x] = value;
    return newGrid;
}

export const checkForDuplicates = (arr: number[]) => {
    const valueToIndex = new Map<number, number>();
    const duplicateIndices: { index: number, value: number }[] = [];

        for (let i = 0; i < arr.length; i++) {
            const value = arr[i];

            if (value === 0 || value === null) continue;
            
            if (valueToIndex.has(value)) {
              duplicateIndices.push({ index: i, value });
              duplicateIndices.push({ index: valueToIndex.get(value) || 0, value });
            } else {
              valueToIndex.set(value, i);
            }
          }
        
          return Array.from(new Set(duplicateIndices));
}

export const checkRowForDuplicates = (puzzle: Puzzle, rowIndex: number) => {
    console.log(`Row values checked: ${puzzle.grid[rowIndex]}`);

    return checkForDuplicates(puzzle.grid[rowIndex])
        .map(dup => ({
            x: dup.index,
            y: rowIndex
        } as CellPosition))
}

export const checkColumnForDuplicates = (puzzle: Puzzle, colIndex: number) => {
    console.log(`Column values checked: ${getColumn(puzzle, colIndex)}`);

    return checkForDuplicates(getColumn(puzzle, colIndex))
        .map(dup => ({
            x: colIndex,
            y: dup.index
        } as CellPosition))
}

export const isSeenClueSatisfied = (clue: number | null | undefined, arr: number[]) => {
    if(!clue) return true;

    const arrayComplete: boolean = !arr.includes(0);

    let currentLargestValueSeen: number = 0;
    let totalSeen: number = 0;
    
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] > currentLargestValueSeen) {
            currentLargestValueSeen = arr[i];
            totalSeen++;
        }
    }

    console.log(`Total Seen in ${arr}: ${totalSeen}, clue: ${clue}`)

    // If the array isn't complete, only want to mark as error if totalSeen exceeds the clue
    // Will be annoying if errors are thrown before user has had the chance to make a mistake
    return arrayComplete ? totalSeen === clue : totalSeen <= clue;
}

  export const getSeenClueErrors = (puzzle: Puzzle, rowOrCol: 'row' | 'col', index: number): SeenClueError[] => {
    let arr: number[];
    const seenCluesWithArray: SeenClueWithArray[] = [];

    switch(rowOrCol) {
        case "row":
            console.log(`Checking seen in ${puzzle.grid[index]} is ${puzzle.clues.left[index]}`)
            console.log(`Checking seen in ${[...puzzle.grid[index]].reverse()} is ${puzzle.clues.right[index]}`)
            arr = puzzle.grid[index];
            seenCluesWithArray.push({
                location: 'left', 
                clueIndex: index, 
                clueValue: puzzle.clues.left[index], 
                arrayFromPuzzle: arr
            },
            {
                location: 'right', 
                clueIndex: index, 
                clueValue: puzzle.clues.right[index], 
                arrayFromPuzzle: [...arr].reverse()
            })
            break;
        case "col":
            console.log(`Checking seen in ${getColumn(puzzle, index)} is ${puzzle.clues.top[index]}`)
            console.log(`Checking seen in ${[...getColumn(puzzle, index)].reverse()} is ${puzzle.clues.bottom[index]}`)
            arr = getColumn(puzzle, index);
            seenCluesWithArray.push({
                location: 'top', 
                clueIndex: index, 
                clueValue: puzzle.clues.top[index], 
                arrayFromPuzzle: arr
            },
            {
                location: 'bottom', 
                clueIndex: index, 
                clueValue: puzzle.clues.bottom[index], 
                arrayFromPuzzle: [...arr].reverse()
            })
            break;
    }

    const errors: SeenClueError[] = seenCluesWithArray.flatMap(clueWithArray => {
        return isSeenClueSatisfied(clueWithArray.clueValue, clueWithArray.arrayFromPuzzle) ? 
            [] : 
            [{
                location: clueWithArray.location, 
                index
            }]
    })

    return errors;
  }

  export const isPuzzleComplete = (grid: number[][]): boolean => {
    return grid.every(row => row.every(cell => cell !== 0));
  };