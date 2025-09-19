import React from 'react'

export function inject<TProps, TInjectedKeys extends keyof TProps>(
    Component: React.JSXElementConstructor<TProps>,
    injector: Pick<TProps, TInjectedKeys>
) {
    return function Injected(props: Omit<TProps, TInjectedKeys>) {
        return <Component {...(props as TProps)} {...injector} />
    }
}

export function withInjectedProps<U extends Record<string, unknown>>(
    injectedProps: U
) {
    return function <T extends U>(Component: React.ComponentType<T>) {
        return function Injected(props: Omit<T, keyof U>) {
            //A type coercion is neccessary because TypeScript doesn't know that the Omit<T, "owner"> + {owner: ...} = T
            const newProps = { ...props, ...injectedProps } as T
            return <Component {...newProps} />
        }
    }
}
