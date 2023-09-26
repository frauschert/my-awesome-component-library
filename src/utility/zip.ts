export default function zip<T1, T2>(a: T1[], b: T2[]): (T1 | T2)[][] {
    return a.map((v, index) => [v, b[index]])
}
