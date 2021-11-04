import React, { PropsWithChildren, CSSProperties } from 'react'

type ExtractStrict<T, U extends T> = Extract<T, U>

type FlexDirection = ExtractStrict<
    NonNullable<CSSProperties['flexDirection']>,
    'row' | 'column' | 'row-reverse' | 'column-reverse'
>

type FlexWrap = ExtractStrict<
    NonNullable<CSSProperties['flexWrap']>,
    'wrap' | 'nowrap' | 'wrap-reverse'
>

type FlexFlow = `${FlexDirection} ${FlexWrap}`

type Gap =
    | `${number}px ${number}px`
    | `${number}% ${number}%`
    | `${number}px ${number}%`
    | `${number}% ${number}px`

export type FlexContainerProps = {
    flexFlow: FlexFlow | undefined
    gap?: Gap
}

const FlexContainer = (props: PropsWithChildren<FlexContainerProps>) => {
    const { flexFlow, gap } = props
    return (
        <div
            style={{
                display: 'flex',
                flexFlow: flexFlow,
                gap: gap,
            }}
        >
            {props.children}
        </div>
    )
}

FlexContainer.Item = <div></div>

export default FlexContainer
