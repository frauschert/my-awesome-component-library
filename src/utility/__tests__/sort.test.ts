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
