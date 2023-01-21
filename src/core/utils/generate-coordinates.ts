import { Area } from '../types/area';
import { Coordinate } from '../types/coordinate';
import { createNoise2D } from 'simplex-noise';

/**
 * Functions for creating random coordinates using a simplex noise
 * 
 * @param numCoordinates Quantity of coordinates that should be generated
 * @param area area to generate noise
 * @param minDistance minimum distance between coordinates
 * @returns array containing the generated coordinates
 */
export function generateCoordinates(numCoordinates: number, area: Area, minDistance: number): Coordinate[] {
  let coordinates: Coordinate[] = [];
  const noise2D = createNoise2D(() => Math.random());

  while (coordinates.length < numCoordinates) {
    let x = area.x + area.width * Math.random();
    let y = area.y + area.height * Math.random();
    let value = noise2D(x, y);
    if (value > 0.5) {
      let isValid = true;
      for (let i = 0; i < coordinates.length; i++) {
        let distance = Math.sqrt(Math.pow(coordinates[i].x - x, 2) + Math.pow(coordinates[i].y - y, 2));
        if (distance < minDistance) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        coordinates.push({x, y});
      }
    }
  }

  return coordinates;
}
