import useEventListener from './useEventListener'
import useTimeout from './useTimeout'

const useIdleEffect = (callback: () => void, ms: number) => {
    const { reset } = useTimeout(callback, ms)
    useEventListener(window, 'pointermove', reset)
    useEventListener(window, 'keypress', reset)
}

export default useIdleEffect
