import { filterAsync } from './filterAsync'

const arr = [1, 2, 3, 4]

function isThreeAsync(value: number): Promise<boolean> {
    return new Promise((res) => {
        setTimeout(() => {
            res(value === 3)
        }, 1)
    })
}

test('should return [3]', () => {
    return filterAsync(arr, (value) => isThreeAsync(value)).then((data) => {
        console.log(data)
        expect(data).toStrictEqual([3])
    })
})
