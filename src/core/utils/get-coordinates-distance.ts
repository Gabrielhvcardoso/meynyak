import { Coordinate } from "../types/coordinate";

export function getCoordinatesDistance(coord1: Coordinate, coord2: Coordinate): number {
    let x1 = coord1.x,
        y1 = coord1.y,
        x2 = coord2.x,
        y2 = coord2.y;

    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
