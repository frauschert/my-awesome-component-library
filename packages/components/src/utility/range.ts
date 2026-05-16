/**
 * Creates an array of numbers from start to end (inclusive), optionally with a step.
 * Supports both ascending and descending ranges.
 *
 * @param start - The starting number (inclusive)
 * @param end - The ending number (inclusive)
 * @param step - The increment between numbers (default: 1 for ascending, -1 for descending)
 * @returns An array of numbers from start to end
 *
 * @example
 * ```ts
 * range(1, 5);
 * // [1, 2, 3, 4, 5]
 *
 * range(0, 10, 2);
 * // [0, 2, 4, 6, 8, 10]
 *
 * range(5, 1);
 * // [5, 4, 3, 2, 1]
 *
 * range(5, 1, -2);
 * // [5, 3, 1]
 *
 * range(0, 0);
 * // [0]
 *
 * // Common use cases:
 * range(1, 100).map(i => fetchPage(i)) // Fetch pages 1-100
 * range(0, 9).map(i => <Item key={i} />) // Render 10 items
 * ```
 */
export function range(start: number, end: number, step?: number): number[] {
    // Determine direction if step not provided
    const defaultStep = start <= end ? 1 : -1
    const actualStep = step ?? defaultStep

    // Validate step direction
    if (actualStep === 0) {
        throw new Error('Step cannot be zero')
    }

    if (start < end && actualStep < 0) {
        throw new Error('Step must be positive when start < end')
    }

    if (start > end && actualStep > 0) {
        throw new Error('Step must be negative when start > end')
    }

    const result: number[] = []

    if (actualStep > 0) {
        for (let i = start; i <= end; i += actualStep) {
            result.push(i)
        }
    } else {
        for (let i = start; i >= end; i += actualStep) {
            result.push(i)
        }
    }

    return result
}

export default range
