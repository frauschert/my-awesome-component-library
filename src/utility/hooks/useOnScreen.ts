import { RefObject, useEffect, useState } from 'react'

export default function useOnScreen(
    ref: RefObject<HTMLElement>,
    rootMargin: string = '0px'
) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (ref.current == null) return
        const target = ref.current
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin }
        )
        observer.observe(target)
        return () => observer.unobserve(target)
    }, [ref, rootMargin])

    return isVisible
}
