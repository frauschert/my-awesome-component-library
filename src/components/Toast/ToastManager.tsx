import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import generateUniqueID from '../../utility/uniqueId'
import Toast from './Toast'

import './toast.css'

type ToastItem = {
    id: string
    content: ReactNode
}

function ToastManager() {
    let toasts: ToastItem[] = []

    const createElement = () => {
        const element = document.createElement('div')
        element.id = 'toastContainer'
        element.className = 'toasts-wrapper bottom-right'
        return document.body.insertAdjacentElement('beforeend', element)
    }

    const toastContainer =
        document.getElementById('toastContainer') ?? createElement()

    const add = (content: ReactNode) => {
        const id = generateUniqueID()
        toasts.push({ id, content })
        render()
    }

    const remove = (id: string) => {
        toasts = toasts.filter((toast) => toast.id !== id)
        render()
    }

    const render = () => {
        const toastLists = toasts.map(({ id, content }) => (
            <Toast key={id} remove={() => remove(id)}>
                {content}
            </Toast>
        ))
        ReactDOM.render(toastLists, toastContainer)
    }

    return { add, remove }
}

const toastManager = ToastManager()
export default toastManager
