import sort from '../sort'

test('should sort by age in ascending order', () => {
    const result = sort(
        [
            { name: 'John', age: 18 },
            { name: 'Peter', age: 16 },
        ],
        'age'
    )
    expect(result).toStrictEqual([
        { name: 'Peter', age: 16 },
        { name: 'John', age: 18 },
    ])
})

test('should sort by name in descending order', () => {
    const result = sort(
        [
            { name: 'John', age: 18 },
            { name: 'Peter', age: 16 },
        ],
        'name',
        'descending'
    )
    expect(result).toStrictEqual([
        { name: 'Peter', age: 16 },
        { name: 'John', age: 18 },
    ])
})

test('should handle a single value array', () => {
    const result = sort([{ name: 'John', age: 18 }], 'age')
    expect(result).toStrictEqual([{ name: 'John', age: 18 }])
})

test('should handle an empty array', () => {
    const value: { name: string; age: number }[] = []
    const result = sort(value, 'age')
    expect(result).toStrictEqual([])
})
