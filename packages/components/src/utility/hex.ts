import { Color, HexColor } from './types'

export default function hex<T extends string>(s: HexColor<T>): Color {
    return s
}
