import isNull from './isNull'
import isUndefined from './isUndefined'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNil(value: any): value is undefined | null {
    return isUndefined(value) || isNull(value)
}

export default isNil
