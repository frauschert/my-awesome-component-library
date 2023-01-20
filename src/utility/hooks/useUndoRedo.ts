import { useCallback, useReducer } from 'react'

type State<T> = {
    past: T[]
    present: T
    future: T[]
}

type UndoRedoAction<T> =
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'SET'; newPresent: T }
    | { type: 'CLEAR'; initialPresent: T }

function createReducer<T>() {
    return (state: State<T>, action: UndoRedoAction<T>): State<T> => {
        const { past, present, future } = state
        switch (action.type) {
            case 'UNDO': {
                const previous = past[past.length - 1]
                const newPast = past.slice(0, past.length - 1)
                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future],
                }
            }
            case 'REDO': {
                const next = future[0]
                const newFuture = future.slice(1)
                return {
                    past: [...past, present],
                    present: next,
                    future: newFuture,
                }
            }
            case 'SET': {
                const { newPresent } = action
                if (newPresent === present) {
                    return state
                }
                return {
                    past: [...past, present],
                    present: newPresent,
                    future: [],
                }
            }
            case 'CLEAR': {
                const { initialPresent } = action
                return {
                    past: [],
                    present: initialPresent,
                    future: [],
                }
            }
        }
    }
}

// Hook
const useHistory = <T>(initialPresent: T) => {
    const reducer = createReducer<T>()
    const [state, dispatch] = useReducer(reducer, {
        past: [],
        present: initialPresent,
        future: [],
    })
    const canUndo = state.past.length !== 0
    const canRedo = state.future.length !== 0
    // Setup our callback functions
    // We memoize with useCallback to prevent unnecessary re-renders
    const undo = useCallback(() => {
        if (canUndo) {
            dispatch({ type: 'UNDO' })
        }
    }, [canUndo, dispatch])
    const redo = useCallback(() => {
        if (canRedo) {
            dispatch({ type: 'REDO' })
        }
    }, [canRedo, dispatch])
    const set = useCallback(
        (newPresent: T) => dispatch({ type: 'SET', newPresent }),
        [dispatch]
    )
    const clear = useCallback(
        () => dispatch({ type: 'CLEAR', initialPresent }),
        [dispatch, initialPresent]
    )
    // If needed we could also return past and future state
    return { state: state.present, set, undo, redo, clear, canUndo, canRedo }
}

export default useHistory
