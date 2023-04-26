import { toastReducer } from '../reducer'

describe('toastReducer', () => {
    it('should add a new toast item', () => {
        const initialState = [{ id: '1', message: 'Hello', content: 'World' }]
        const newToastItem = { id: '2', message: 'World', content: 'Hello' }

        expect(
            toastReducer(initialState, { type: 'add', payload: newToastItem })
        ).toEqual([...initialState, newToastItem])
    })

    it('should remove a toast item', () => {
        const initialState = [
            { id: '1', message: 'Hello', content: 'World' },
            { id: '2', message: 'World', content: 'Hello' },
        ]

        expect(
            toastReducer(initialState, { type: 'remove', payload: { id: '1' } })
        ).toEqual([initialState[1]])
    })
})
