/**
 * Returns a array containing all numbers between start and end numbers (inclusive).
 * 
 * E.g.:
 * ```
 * range(1, 3) -> [1, 2, 3]
 * range(4, 5) -> [4, 5]
 * ```
 */
export function range(start: number, end: number): number[] {
    const size = end - (start - 1);
    return Array.apply(null, Array(size)).map((_, i) => start + i);
}
