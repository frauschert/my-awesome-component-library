type PathSegments<Path extends string> =
    Path extends `${infer SegmentA}/${infer SegmentB}`
        ? ParamOnly<SegmentA> | PathSegments<SegmentB>
        : ParamOnly<Path>

type ParamOnly<Segment> = Segment extends `:${infer Param}` ? Param : never

type RouteParams<Path extends string> = {
    [Key in PathSegments<Path>]: string | number
}

type RouteMap<T extends Record<string, Route> = Record<string, Route>> = {
    [K in keyof T]: T[K]
}

type Route<TPath extends string = string> = {
    path: TPath
}

export function makeRouteMap<
    TKey extends string,
    TValue extends Route<TRouteKey>,
    TRouteKey extends string,
    T extends Record<TKey, TValue>
>(routes: T): RouteMap<T> {
    return Object.entries(routes as Record<string, Route>).reduce(
        (acc, [key, path]) => {
            return {
                ...acc,
                [key]: { path: path.path },
            }
        },
        {} as RouteMap<T>
    )
}

type Navigate<T extends Record<string, string>> = {
    [K in keyof T]: keyof RouteParams<T[K]> extends never
        ? () => void
        : (params: RouteParams<T[K]>) => void
}

export function makeNavigate<
    Key extends string,
    Value extends string,
    T extends Record<Key, Value>
>(routeMap: T, goTo: (route: string) => void): Navigate<T> {
    return Object.entries(routeMap as Record<string, string>).reduce(
        (acc, [key, path]) => {
            const pathSegments = path.split('/')
            const routeParams = pathSegments.filter((p) => p.startsWith(':'))
            return {
                ...acc,
                [key]:
                    routeParams.length === 0
                        ? () => goTo(path)
                        : (params: Record<string, string | number>) =>
                              goTo(
                                  pathSegments
                                      .map((pathSegment) => {
                                          const value =
                                              params[pathSegment.slice(1)]
                                          return value
                                              ? String(value)
                                              : pathSegment
                                      })
                                      .join('/')
                              ),
            }
        },
        {} as Navigate<T>
    )
}
