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

function createReducer<T>(isEqual?: (a: T, b: T) => boolean) {
    return (state: State<T>, action: UndoRedoAction<T>): State<T> => {
        const { past, present, future } = state
        switch (action.type) {
            case 'UNDO': {
                if (past.length === 0) return state // Guard: nothing to undo
                const previous = past[past.length - 1]
                const newPast = past.slice(0, past.length - 1)
                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future],
                }
            }
            case 'REDO': {
                if (future.length === 0) return state // Guard: nothing to redo
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
                const equal = isEqual
                    ? isEqual(newPresent, present)
                    : newPresent === present
                if (equal) {
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

/**
 * useUndoRedo is a custom React hook that provides undo/redo functionality for any state.
 *
 * @template T - The type of the state to manage.
 * @param initialPresent - The initial state value.
 * @param isEqual - Optional custom equality function for comparing state values.
 * @returns An object with:
 *   - state: The current state value.
 *   - set: Function to set a new state value.
 *   - undo: Function to undo the last state change.
 *   - redo: Function to redo the last undone state change.
 *   - clear: Function to clear history and reset to initial state.
 *   - canUndo: Boolean indicating if undo is possible.
 *   - canRedo: Boolean indicating if redo is possible.
 *   - past: Array of previous state values.
 *   - future: Array of future state values (for redo).
 */
export default function useUndoRedo<T>(
    initialPresent: T,
    isEqual?: (a: T, b: T) => boolean
) {
    const reducer = createReducer<T>(isEqual)
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

    return {
        state: state.present,
        set,
        undo,
        redo,
        clear,
        canUndo,
        canRedo,
        past: state.past,
        future: state.future,
    }
}
