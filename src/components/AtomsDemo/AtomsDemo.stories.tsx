import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
    atom,
    useAtom,
    useAtomValue,
    useSetAtom,
    useAtomSelector,
} from '../../index'

const counterAtom = atom(0)
const doubledAtom = atom<number>((get) => get(counterAtom) * 2)
const objectAtom = atom({ a: 1, b: 2 })

function Counter() {
    const [count, setCount] = useAtom(counterAtom)
    const inc = () => setCount(count + 1)
    const dec = () => setCount(count - 1)
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={dec}>-</button>
            <span>{count}</span>
            <button onClick={inc}>+</button>
        </div>
    )
}

function Doubled() {
    const v = useAtomValue(doubledAtom)
    return <div>Doubled: {v}</div>
}

function RenderCounter({ label }: { label: string }) {
    const renders = React.useRef(0)
    renders.current += 1
    return (
        <small style={{ opacity: 0.6 }}>
            {label} renders: {renders.current}
        </small>
    )
}

function SelectorDemo() {
    const a = useAtomSelector(objectAtom, (o) => o.a)
    const set = useSetAtom(objectAtom)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RenderCounter label="Selector" />
            <div>a: {a}</div>
            <button onClick={() => set({ ...objectAtom.get(), a: a + 1 })}>
                inc a
            </button>
            <button
                onClick={() => set({ ...objectAtom.get(), b: Math.random() })}
            >
                change b only
            </button>
            <small>Changing b should not re-render the selected a</small>
        </div>
    )
}

const meta: Meta = {
    title: 'Utility/Atoms Demo',
}
export default meta

export const Basic: StoryObj = {
    render: () => (
        <div style={{ display: 'grid', gap: 12 }}>
            <Counter />
            <Doubled />
        </div>
    ),
}

export const Selector: StoryObj = {
    render: () => <SelectorDemo />,
}
