import { useEffect, useState } from 'react'

export interface UsePortalOptions {
    /**
     * Optional id for the portal element. If an element with this id exists,
     * it will be reused instead of creating a new one.
     */
    id?: string
    /**
     * Optional class name to apply to the portal element.
     */
    className?: string
    /**
     * Parent element to append the portal element to.
     * Defaults to document.body when available.
     */
    parent?: HTMLElement | null
}

/**
 * Hook that creates (or reuses) a DOM node for React portals.
 *
 * @example
 * const portalNode = usePortal({ id: 'modal-root' })
 *
 * if (!portalNode) return null
 * return createPortal(children, portalNode)
 */
export default function usePortal(
    options: UsePortalOptions = {}
): HTMLElement | null {
    const { id, className, parent } = options
    const [portalNode, setPortalNode] = useState<HTMLElement | null>(null)

    useEffect(() => {
        if (typeof document === 'undefined') {
            return
        }

        const targetParent = parent ?? document.body

        if (!targetParent) {
            return
        }

        let node: HTMLElement | null = null
        let created = false

        if (id) {
            node = document.getElementById(id)
            if (!node) {
                node = document.createElement('div')
                node.id = id
                created = true
            }
        } else {
            node = document.createElement('div')
            created = true
        }

        if (className) {
            node.className = className
        }

        if (!node.parentElement) {
            targetParent.appendChild(node)
        }

        setPortalNode(node)

        return () => {
            if (created && node?.parentElement) {
                node.parentElement.removeChild(node)
            }
        }
    }, [id, className, parent])

    return portalNode
}
