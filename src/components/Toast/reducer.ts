import { ReactNode } from 'react'

type ToastItem = {
    id: string
    content: ReactNode
}

type ToastAdd = {
    type: 'add'
    payload: ToastItem
}

type ToastRemove = {
    type: 'remove'
    payload: {
        id: string
    }
}

type ToastAction = ToastAdd | ToastRemove

export function toastReducer(state: ToastItem[], action: ToastAction) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload]
        case 'remove':
            return state.filter((t) => t.id !== action.payload.id)
        default:
            return state
    }
}
