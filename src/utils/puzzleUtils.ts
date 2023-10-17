import { Puzzle } from "../models/Puzzle";

export const parsePuzzlesFromJson = (jsonObj: any): Puzzle[] => {
    if (!Array.isArray(jsonObj)) {
      throw new Error("Invalid input: root should be an array.");
    }
  
    // jsonObj.map((obj) => {
    //   // Validate and/or transform each field here
    //   if (
    //     typeof obj.id !== "string" ||
    //     typeof obj.size !== "object" ||
    //     !Array.isArray(obj.grid) ||
    //     typeof obj.clues !== "object"
    //   ) {
    //     throw new Error("Invalid object structure");
    //   }
  
      return jsonObj as Puzzle[];
    }
  

export const serialisePuzzleToJson = (puzzle: Puzzle): string => {
    return JSON.stringify(puzzle);
};

export const getRandomPuzzle = (puzzles: Puzzle[], size: number): Puzzle | undefined => {
    const puzzlesOfCorrectSize = puzzles.filter(p => p.size.rows === size && p.size.columns === size);
    return puzzlesOfCorrectSize.length ? puzzlesOfCorrectSize[Math.floor(Math.random() * puzzlesOfCorrectSize.length)] : undefined
}