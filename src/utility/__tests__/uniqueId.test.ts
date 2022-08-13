import generateUniqueID from '../uniqueId'

describe('generateUniqueID', () => {
    test('should be equal', () => {
        const array: string[] = []
        for (let i = 0; i < 1000; i++) {
            array.push(generateUniqueID())
        }
        const set = new Set(array)

        expect(array.length).toBe(set.size)
    })
})
