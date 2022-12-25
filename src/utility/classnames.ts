export function classNames(
    ...classNames: (string | Record<string, boolean> | undefined | null)[]
): string {
    const _classNames: string[] = []

    for (const arg of classNames) {
        if (typeof arg === 'string') {
            _classNames.push(arg)
        } else if (typeof arg === 'object') {
            for (const className in arg) {
                if (arg[className]) {
                    _classNames.push(className)
                }
            }
        }
    }

    return _classNames.join(' ')
}
