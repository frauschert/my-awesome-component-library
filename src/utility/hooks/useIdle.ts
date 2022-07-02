import useEventListener from './useEventListener'
import useTimeout from './useTimeout'

const useIdle = (onIdle: () => void, ms: number) => {
    const { reset } = useTimeout(onIdle, ms)
    useEventListener(window, 'pointermove', reset)
    useEventListener(window, 'keypress', reset)
}

export default useIdle
