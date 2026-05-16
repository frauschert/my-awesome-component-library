const clamp = (min: number, max: number, value: number) => {
    if (min > max) throw new Error('min cannot be greater than max')
    return Math.max(min, Math.min(max, value))
}

export default clamp
