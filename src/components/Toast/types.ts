import { ReactNode } from 'react'

export type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
export type ToastItem = {
    id: string
    content: ReactNode
    position?: Position
    duration?: number
}

export type ToastItemWithoutId = Omit<ToastItem, 'id'>
