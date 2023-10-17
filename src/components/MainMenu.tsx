import React from "react";
import './MainMenu.css'

interface MainMenuProps {
    selectedPuzzleSize: number,
    onGameStart: () => void,
    onPuzzleSizeChange: (size: number) => void
}

const MainMenu: React.FC<MainMenuProps> = ({
    selectedPuzzleSize,
    onGameStart,
    onPuzzleSizeChange
}) => {

    return (
        <div className="main-menu">
            <h1>Skyscrapers</h1>
            <p>Puzzle Size</p>
            <div className="puzzle-size-btns">
                <SizeButton size={3} isSelected={selectedPuzzleSize === 3} onPuzzleSizeChange={onPuzzleSizeChange} />
                <SizeButton size={4} isSelected={selectedPuzzleSize === 4} onPuzzleSizeChange={onPuzzleSizeChange} />
                <SizeButton size={5} isSelected={selectedPuzzleSize === 5} onPuzzleSizeChange={onPuzzleSizeChange} />
            </div>
            <button className="start-btn" onClick={onGameStart}>Start Game</button>
        </div>
    )
}

interface SizeButtonProps {
    size: number,
    isSelected: boolean,
    onPuzzleSizeChange: (size: number) => void
}

const SizeButton: React.FC<SizeButtonProps> = ({
    size,
    isSelected,
    onPuzzleSizeChange
}) => {
    const handleClick = () => {
        onPuzzleSizeChange(size);
    }

    return (
        <button className={`size-btn size-${size} ${isSelected ? 'selected' : ''}`} onClick={handleClick}>{size}</button>
    )
}

export default MainMenu;
