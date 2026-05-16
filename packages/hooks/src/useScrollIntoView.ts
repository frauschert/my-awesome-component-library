import { RefObject, useEffect } from 'react'

export default function useScrollIntoView<T extends HTMLElement>(
    ref: RefObject<T>
) {
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView()
        }
    })
}
