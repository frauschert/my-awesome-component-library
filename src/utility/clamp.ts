const clamp = (min: number, max: number, value: number) => {
    if (min > max) throw new Error('min cannot be greater than max')
    return value < min ? min : value > max ? max : value
}

export default clamp
