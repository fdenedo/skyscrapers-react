export interface CellPosition {
    x: number,
    y: number
}

export interface PencilLayerIF {
    cornerValues: Set<number>,
    centreValues: Set<number>
}
