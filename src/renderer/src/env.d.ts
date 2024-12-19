/// <reference types="vite/client" />

export interface MouseClickedItem {
    time: number,
    x: number,
    y: number
}

export interface MouseClickedData {
    left: MouseClickedItem[],
    right: MouseClickedItem[]
}
