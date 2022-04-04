import React from 'react'

export function inject<TProps, TInjectedKeys extends keyof TProps>(
    Component: React.JSXElementConstructor<TProps>,
    injector: Pick<TProps, TInjectedKeys>
) {
    return function Injected(props: Omit<TProps, TInjectedKeys>) {
        return <Component {...(props as TProps)} {...injector} />
    }
}
