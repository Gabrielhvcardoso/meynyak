/**
 * Function that return a random item of a given array
 */
export function randomItem<T = any>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
