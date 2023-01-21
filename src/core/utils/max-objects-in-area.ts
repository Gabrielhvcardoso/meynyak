import { Area } from "../types/area";

interface ObjectProperties {
    width: number;
    height: number;
}

/**
 * Functions that calculate the max number of objects with a given width and height
 * contained in a area spaced by a minimum distance.
 */
export function getMaxObjectsInArea(area: Area, objectProperties: ObjectProperties, minDistance: number): number {
    let maxObjects = 0;
    let x = 0;
    let y = 0;

    while (y + objectProperties.height <= area.height) {
        while (x + objectProperties.width <= area.width) {
            maxObjects++;
            x += (objectProperties.width + minDistance);
        }
        x = 0;
        y += (objectProperties.height + minDistance);
    }
    return maxObjects;
}
