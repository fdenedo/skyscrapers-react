import React, { useState } from "react";
import './App.css';
import PuzzleArea from "./components/PuzzleArea";
import MainMenu from "./components/MainMenu";
import { Puzzle } from "./models/Puzzle";

import puzzles from './resources/puzzles.json';
import { getRandomPuzzle, parsePuzzlesFromJson } from "./utils/puzzleUtils";

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleSize, setPuzzleSize] = useState<number | null>(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>();

  const defaultPuzzleSize = 5;

  const parsedPuzzles: Puzzle[] | null = parsePuzzlesFromJson(puzzles);

  const handleGameStart = () => {
    const puzzle = puzzleSize 
      ? getRandomPuzzle(parsedPuzzles, puzzleSize) 
      : getRandomPuzzle(parsedPuzzles, defaultPuzzleSize);

    setSelectedPuzzle(puzzle);
    setGameStarted(true);
  }

  const handlePuzzleSizeChange = (size: number) => setPuzzleSize(size);

  return (
    <div className='App'>
      {gameStarted ? (
        selectedPuzzle ? <PuzzleArea puzzle={selectedPuzzle} /> : <div className="Loading">Loading</div>
      ) : (
        <MainMenu 
          selectedPuzzleSize={puzzleSize ? puzzleSize : defaultPuzzleSize} 
          onGameStart={handleGameStart}
          onPuzzleSizeChange={handlePuzzleSizeChange} 
        />
      )}
    </div>
  )
}

export default App;
