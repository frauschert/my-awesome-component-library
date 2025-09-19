import React from 'react'
import useClickOutside from '../hooks/useClickOutside'

export interface WithClickOutsideOptions {
    onOutsideClick?: (e: MouseEvent) => void
}

export function withClickOutside<
    P extends { onOutsideClick?: (e: MouseEvent) => void }
>(Component: React.ComponentType<P>, options: WithClickOutsideOptions = {}) {
    const Wrapped: React.FC<P> = (props) => {
        const ref = React.useRef<HTMLDivElement>(null)

        const handler = props.onOutsideClick || options.onOutsideClick
        // useClickOutside expects RefObject<T>, our ref matches that shape
        useClickOutside(ref as React.RefObject<HTMLDivElement>, (e) => {
            handler?.(e)
        })

        return (
            <div ref={ref} data-hoc="withClickOutside">
                <Component {...(props as any)} />
            </div>
        )
    }

    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withClickOutside(${name})`
    return Wrapped
}
