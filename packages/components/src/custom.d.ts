declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    export default content
}

declare module '*.scss' {
    const styles: Record<string, string>
    export default styles
}

// Wake Lock API types
interface WakeLockSentinel extends EventTarget {
    readonly released: boolean
    readonly type: 'screen'
    release(): Promise<void>
}

interface Navigator {
    wakeLock?: {
        request(type: 'screen'): Promise<WakeLockSentinel>
    }
}
