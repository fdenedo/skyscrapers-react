import React from "react";
import { useState, useEffect } from "react";
import './Cell.css'
import { PencilLayerIF } from "../models/Cell";

interface CellProps {
    x: number;
    y: number;
    isSelected: boolean;
    isGiven?: boolean;
    isError?: boolean;
    isFirstInteractableInGrid?: boolean;
    value: number | null;
    pencilMarks: PencilLayerIF;
    inputType: 'value' | 'corner' | 'centre';
    onClick: (shiftPressed: boolean) => void;
    onFocus: () => void;
}

const Cell: React.FC<CellProps> = ({ 
    x, 
    y, 
    isSelected, 
    isGiven,
    isError,
    isFirstInteractableInGrid,
    value, 
    pencilMarks,
    inputType,
    onClick,
    onFocus
}) => {
    const [marks, setMarks] = useState<PencilLayerIF>(pencilMarks);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const shiftPressed = e.shiftKey;
      onClick(shiftPressed);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputType !== 'value') {
        const value = parseInt(e.key, 10);
        if (!isNaN(value)) {
          const location = inputType === 'corner' ? 'corner' : 'centre';
          addPencilMark(value, location);
        }
      }
    };

    const addPencilMark = (value: number, location: 'corner' | 'centre') => {
      let newMarks: PencilLayerIF;

      switch(location) {
        case "corner":
          newMarks = {...marks, cornerValues: new Set([...marks.cornerValues, value])};
          break;
        case "centre":
          newMarks = {...marks, centreValues: new Set([...marks.centreValues, value])};
          break;
      }

      setMarks(newMarks);
    }

    // const removePencilMark = (value: number, location: 'corner' | 'centre') => {
    //   let newMarks: PencilLayerIF;

    //   switch(location) {
    //     case "corner":
    //       newMarks = {
    //         ...marks,
    //         cornerValues: new Set(Array.from(marks.cornerValues).filter(mark => mark !== value))
    //       };
    //       break;
    //     case "centre":
    //       newMarks = {
    //         ...marks,
    //         centreValues: new Set(Array.from(marks.centreValues).filter(mark => mark !== value))
    //       };
    //       break;
    //   }

    //   setMarks(newMarks);
    // }

    useEffect(() => {
      const cellElement = document.querySelector(`[data-x='${x}'][data-y='${y}']`) as HTMLElement;
      cellElement?.addEventListener('keydown', handleKeyDown);
      return () => {
        cellElement?.removeEventListener('keydown', handleKeyDown);
      };
    });

    return (
      <div className={`cell ${!isGiven && isSelected ? "selected" : ""} ${isGiven ? "given" : ""} ${isError ? "error" : ""}`} 
        data-x={x} 
        data-y={y} 
        onClick={handleClick}
      >
        {pencilMarks.cornerValues.size > 0 || pencilMarks.centreValues.size > 0 ? (
          <PencilLayer pencilMarks={marks} />
        ) : (
          <div className="cell-inner" onFocus={onFocus} tabIndex={!isGiven && isFirstInteractableInGrid ? 0 : -1}>{value}</div>
        )}
      </div>
    )
  }

  interface PencilLayerProps {
    pencilMarks: PencilLayerIF
  }

  const PencilLayer: React.FC<PencilLayerProps> = ({
    pencilMarks
  }) => {
    const cornerMarksAsOrderedString: String = Array.from(pencilMarks.cornerValues).sort((a, b) => a - b).join('');
    const centreMarksAsOrderedString: String = Array.from(pencilMarks.centreValues).sort((a, b) => a - b).join('');

    return (
      <div className="pencil-layer">
        <div className="pencil-layer-corner">{cornerMarksAsOrderedString}</div>
        <div className="pencil-layer-centre">{centreMarksAsOrderedString}</div>
      </div>
    )
  }

  export default Cell;