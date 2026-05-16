import { EffectCallback, useEffect } from 'react'

export default function useEffectOnce(callback: EffectCallback) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(callback, [])
}
