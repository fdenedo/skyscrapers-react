import React from "react";
import './SeenClueContainer.css'
import { SeenClueError } from "../models/PuzzleErrors";

interface SeenClueContainerProps {
    position: 'top' | 'bottom' | 'left' | 'right';
    clues?: (number | null)[];
    errors?: SeenClueError[];
}

const SeenClueContainer: React.FC<SeenClueContainerProps> = ({ 
    position, 
    clues,
    errors = []
}) => {

    return (
        <div className={`seen-clue-container ${position} ${clues ? '' : 'empty'}`}>
            {clues && clues.map((clue, index) => (
                <div 
                    className={
                        `clue ${errors.some(error => error.location === position && error.index === index) 
                            ? 'error' 
                            : ''}`
                        } 
                    key={index} 
                    data-index={index}>{clue ? clue : ''}
                </div>
            ))}
        </div>
    )
}

export default SeenClueContainer;
