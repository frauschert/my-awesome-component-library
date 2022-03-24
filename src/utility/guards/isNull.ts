// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNull(value: any): value is null {
    return typeof value === null
}

export default isNull
