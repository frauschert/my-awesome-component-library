function isNil(value: any): value is undefined | null {
    return typeof value === undefined || typeof value === null
}

export default isNil
