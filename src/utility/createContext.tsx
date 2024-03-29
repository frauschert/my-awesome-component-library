import React, {
    useRef,
    createContext as createReactContext,
    useContext,
    useCallback,
    useState,
    useEffect,
} from 'react'

type SetStateAction<S> = S | ((prevState: S) => S)

export function createContext<Store extends Record<string, unknown>>(
    initialState: Store
) {
    function useStoreData(): {
        get: () => Store
        set: (value: SetStateAction<Store>) => void
        subscribe: (callback: () => void) => () => void
    } {
        const store = useRef(initialState)

        const get = useCallback(() => store.current, [])

        const subscribers = useRef(new Set<() => void>())

        const set = useCallback((value: SetStateAction<Store>) => {
            store.current =
                typeof value === 'function' ? value(store.current) : value

            subscribers.current.forEach((callback) => callback())
        }, [])

        const subscribe = useCallback((callback: () => void) => {
            subscribers.current.add(callback)
            return () => subscribers.current.delete(callback)
        }, [])

        return {
            get,
            set,
            subscribe,
        }
    }

    type UseStoreDataReturnType = ReturnType<typeof useStoreData>

    const StoreContext = createReactContext<UseStoreDataReturnType | null>(null)

    function Provider({ children }: { children: React.ReactNode }) {
        return (
            <StoreContext.Provider value={useStoreData()}>
                {children}
            </StoreContext.Provider>
        )
    }

    function Consumer({
        children,
    }: {
        children: (store: UseStoreDataReturnType) => React.ReactNode
    }) {
        return (
            <StoreContext.Consumer>
                {(store) => store && children(store)}
            </StoreContext.Consumer>
        )
    }

    function withStore<TProps, TSelectedProps extends keyof TProps>(
        Component: React.JSXElementConstructor<TProps>
    ): (props: Omit<TProps, TSelectedProps>) => JSX.Element
    function withStore<TProps, TSelectedProps extends keyof TProps>(
        Component: React.JSXElementConstructor<TProps>,
        selector: (store: Store) => Pick<TProps, TSelectedProps>
    ): (props: Omit<TProps, TSelectedProps>) => JSX.Element
    function withStore<TProps, TSelectedProps extends keyof TProps>(
        Component: React.JSXElementConstructor<TProps>,
        selector?: (store: Store) => Pick<TProps, TSelectedProps>
    ): (props: Omit<TProps, TSelectedProps>) => JSX.Element {
        return selector
            ? (props: Omit<TProps, TSelectedProps>) => {
                  const store = useStore(selector)
                  return <Component {...(props as TProps)} {...store} />
              }
            : (props: Omit<TProps, TSelectedProps>) => {
                  const store = useStore()
                  return <Component {...(props as TProps)} {...store} />
              }
    }

    function useStore(): [Store, (value: SetStateAction<Store>) => void]
    function useStore<SelectorOutput = Store>(
        selector: (store: Store) => SelectorOutput
    ): [SelectorOutput, (value: SetStateAction<Store>) => void]
    function useStore<SelectorOutput = Store>(
        selector?: (store: Store) => SelectorOutput
    ) {
        const store = useContext(StoreContext)
        if (!store) {
            throw new Error('Store not found')
        }

        const [state, setState] = useState(() =>
            selector ? selector(initialState) : initialState
        )

        useEffect(() => {
            return store.subscribe(() =>
                setState(selector ? selector(store.get()) : store.get())
            )
        })

        return [state, store.set] as const
    }

    return {
        Provider,
        Consumer,
        withStore,
        useStore,
    }
}
