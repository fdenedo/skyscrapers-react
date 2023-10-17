import React from "react";
import './Cell.css'

interface CellProps {
    x: number;
    y: number;
    isSelected: boolean;
    isGiven?: boolean;
    isError?: boolean;
    value: number | null;
    onClick: (shiftPressed: boolean) => void;
    onFocus: () => void;
}

const Cell: React.FC<CellProps> = ({ 
    x, 
    y, 
    isSelected, 
    isGiven,
    isError,
    value, 
    onClick,
    onFocus 
}) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const shiftPressed = e.shiftKey;
      onClick(shiftPressed);
    }

    return (
      <div className={`cell ${!isGiven && isSelected ? "selected" : ""} ${isGiven ? "given" : ""} ${isError ? "error" : ""}`} 
        data-x={x} 
        data-y={y} 
        onClick={handleClick}
      >
        <div className="cell-inner" onFocus={onFocus} tabIndex={isGiven ? -1 : 0}>{value}</div>      
      </div>
    )
  }

  export default Cell;