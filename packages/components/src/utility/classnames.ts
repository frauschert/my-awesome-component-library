/**
 * Concatenates class names together, filtering out falsy values.
 * Supports strings, objects with boolean values, arrays, and nullable types.
 *
 * @param classNames - Variable number of class name arguments
 * @returns A single space-separated string of class names
 *
 * @example
 * // String arguments
 * classNames('foo', 'bar');
 * // => 'foo bar'
 *
 * @example
 * // Conditional objects
 * classNames('foo', { active: true, disabled: false });
 * // => 'foo active'
 *
 * @example
 * // With nullable values
 * classNames('foo', null, undefined, 'bar');
 * // => 'foo bar'
 *
 * @example
 * // With arrays
 * classNames('foo', ['bar', 'baz']);
 * // => 'foo bar baz'
 *
 * @example
 * // Mixed usage
 * classNames('btn', { 'btn-primary': true }, ['large', { active: isActive }]);
 */
type ClassValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | { [key: string]: boolean | null | undefined }
    | ClassValue[]

export function classNames(...args: ClassValue[]): string {
    const _classNames: string[] = []

    for (const arg of args) {
        // Skip falsy values (null, undefined, false, 0, '', NaN)
        if (!arg) continue

        if (typeof arg === 'string') {
            _classNames.push(arg)
        } else if (Array.isArray(arg)) {
            // Recursively handle arrays
            const nested = classNames(...arg)
            if (nested) _classNames.push(nested)
        } else if (typeof arg === 'object') {
            // Only check own enumerable properties
            for (const className in arg) {
                if (
                    Object.prototype.hasOwnProperty.call(arg, className) &&
                    arg[className]
                ) {
                    _classNames.push(className)
                }
            }
        }
    }

    return _classNames.join(' ')
}
