// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUndefined(value: any): value is undefined {
    return typeof value === undefined
}

export default isUndefined
