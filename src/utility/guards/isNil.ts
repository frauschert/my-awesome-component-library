import isNull from './isNull'
import isUndefined from './isUndefined'

export default function isNil<T>(
    value: T | undefined | null
): value is undefined | null {
    return isUndefined(value) || isNull(value)
}
