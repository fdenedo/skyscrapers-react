import React from "react";
import { useState, useEffect } from "react";
import Cell from "./Cell";
import './Grid.css'
import { CellPosition } from "../models/Cell";

interface GridProps {
    xSize: number,
    ySize: number,
    givenDigits: (number | null)[][],
    errors: CellPosition[],
    onCellChange: (cellsChanged: CellPosition[], newGridValues: (number | null)[][]) => void
}

const Grid: React.FC<GridProps> = ({ 
    xSize, 
    ySize,
    givenDigits,
    errors = [],
    onCellChange
}) => {
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
  const [gridValues, setGridValues] = useState(givenDigits);
  const [shouldResetCellSelection, setShouldResetCellSelection] = useState(true);
  const [isGivenCells] = useState<boolean[][]>(givenDigits.map(row => row.map(cell => !!cell)));
  const [firstInteractableCell, setFirstInteractableCell] = useState<CellPosition | null>(null);
  const [inputType, setInputType] = useState<'value' | 'corner' | 'centre'>('value');

  const keyActions = [
    {
      condition: (key: string) => key === 'Backspace' || key === 'Delete',
      action: () => changeValueOfSelectedCells(null)
    },
    {
      condition: (key: string) => key === 'Escape',
      action: () => setSelectedCells([])
    },
    {
        condition: (key: string) => key === 'ArrowUp',
        action: () => moveSelectedCells('up')
      },
      {
        condition: (key: string) => key === 'ArrowDown',
        action: () => moveSelectedCells('down')
      },
      {
        condition: (key: string) => key === 'ArrowLeft',
        action: () => moveSelectedCells('left')
      },
      {
        condition: (key: string) => key === 'ArrowRight',
        action: () => moveSelectedCells('right')
      },
    {
      condition: (key: string) => parseInt(key) && parseInt(key) <= Math.max(xSize, ySize),
      action: (key: string) => changeValueOfSelectedCells(parseInt(key))
    },
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    for (const { condition, action } of keyActions) {
        if (condition(key)) {
            action(key);
            break;
        }
    }
  }

  const cycleInputType = () => {
    setInputType(inputType === 'value' ? 'corner' : (inputType === 'corner' ? 'centre' : 'value'));
  };

  useEffect(() => {
    const gridElement = document.querySelector('.grid') as HTMLElement;
    gridElement?.addEventListener('keydown', handleKeyDown);
    return () => {
        gridElement?.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    for (let y = 0; y < ySize; y++) {
      for (let x = 0; x < xSize; x++) {
        if (!isGivenCells[y][x]) {
          setFirstInteractableCell({ x, y });
          return;
        }
      }
    }
  }, [isGivenCells, xSize, ySize]);

  const isCellSelected = (x: number, y: number): boolean => {
    return selectedCells.some(cell => cell.x === x && cell.y === y);
  }

  const changeValueOfSelectedCells = (value: number | null) => {
    const newGridValues = [...gridValues]
    for(let cell of selectedCells) {
        if(isGivenCells[cell.y][cell.x]) continue;
        const {x, y} = cell;
        newGridValues[y][x] = value;
    }

    setGridValues(newGridValues);
    onCellChange(selectedCells, newGridValues);
  }

  const moveSelectedCells = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newSelectedCells: CellPosition[] = [];

    switch(direction) {
        case "up":
            newSelectedCells = selectedCells.map(cell => {
                const newY = Math.max(0, cell.y - 1);
                return { ...cell, y: newY };
            });
            break;
        case "down":
            newSelectedCells = selectedCells.map(cell => {
                const newY = Math.min(ySize - 1, cell.y + 1); 
                return { ...cell, y: newY };
            });
            break;
        case "left":
            newSelectedCells = selectedCells.map(cell => {
                const newX = Math.max(0, cell.x - 1);
                return { ...cell, x: newX };
            });
            break;
        case "right":
            newSelectedCells = selectedCells.map(cell => {
                const newX = Math.min(xSize - 1, cell.x + 1);
                return { ...cell, x: newX };
            });
            break;
    }

    setSelectedCells(newSelectedCells);
  }

  const handleCellClick = (x: number, y: number, shiftPressed: boolean) => {
    setShouldResetCellSelection(!shiftPressed);

    setSelectedCells(prevSelectedCells => {
        if(shouldResetCellSelection) return [{x, y}] 
        else return [...prevSelectedCells, {x, y}]
    });
  }

  const handleCellFocus = (x: number, y: number) => {
    setSelectedCells(prevSelectedCells => {
        if(shouldResetCellSelection) return [{x, y}] 
        else return [...prevSelectedCells, {x, y}]
    });
  }

  return (
    <div className="grid">
        <button onClick={cycleInputType}>Cycle Input Type</button>
        {gridValues.map((row, y) => (
            <div className="grid-row" key={y}>
                {row.map((cellValue, x) => (
                    <Cell
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        isSelected={isCellSelected(x, y)}
                        isGiven={isGivenCells[y][x]}
                        isError={errors.some(cell => x === cell.x && y === cell.y)}
                        isFirstInteractableInGrid={firstInteractableCell?.x === x && firstInteractableCell?.y === y}
                        value={cellValue === 0 ? null : cellValue}
                        pencilMarks={}  // This will need to come from Cell's state
                        inputType={inputType}  // Passing the inputType to Cell
                        onClick={(shiftPressed) => handleCellClick(x, y, shiftPressed)}
                        onFocus={() => handleCellFocus(x, y)}
                    />
                ))}
            </div>
        ))}
    </div>
);
}

export default Grid;
