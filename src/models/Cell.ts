export interface CellPosition {
    x: number,
    y: number
}

export interface CellPencilLayer {
    cornerValues: Set<number>,
    centreValues: Set<number>
}
