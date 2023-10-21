import React from "react";
import './Cell.css'

interface CellProps {
    x: number;
    y: number;
    isSelected: boolean;
    isGiven?: boolean;
    isError?: boolean;
    isFirstInteractableInGrid?: boolean;
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
    isFirstInteractableInGrid,
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
        <div className="cell-inner" onFocus={onFocus} tabIndex={!isGiven && isFirstInteractableInGrid ? 0 : -1}>
          {value ? <Skyscraper value={value} /> : null}
        </div>      
      </div>
    )
  }

interface SkyscraperProps {
  value: number
}

const Skyscraper: React.FC<SkyscraperProps> = ({
  value
}) => {
  const colourMap: Record<number, string> = {
    1: '#f5a85b',
    2: '#7ad8f0',
    3: '#bcf76f',
    4: '#f285f2',
    5: '#fa89a4',
    6: 'green',
    7: 'green',
    8: 'green',
    9: 'green'
  };

  const style = {
    backgroundColor: colourMap[value],
  }

  return (
    <div className={`skyscraper value-${value}`} style={style}>{value}</div>
  )
}

export default Cell;