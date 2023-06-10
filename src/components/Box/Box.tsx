import React, { forwardRef } from 'react'

// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithoutRef on its own
export type PropsOf<
    T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<T, React.ComponentPropsWithoutRef<T>>

type AsProp<T extends React.ElementType> = {
    /**
     * An override of the default HTML tag.
     * Can also be another React component.
     */
    as?: T
}

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<ExtendedProps, OverrideProps> = OverrideProps &
    Omit<ExtendedProps, keyof OverrideProps>

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<
    T extends React.ElementType,
    Props
> = ExtendableProps<PropsOf<T>, Props>

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type PolymorphicComponentProps<
    T extends React.ElementType,
    Props
> = InheritableElementProps<T, Props & AsProp<T>>

export type PolymorphicRef<T extends React.ElementType> =
    React.ComponentPropsWithRef<T>['ref']

export type PolymorphicComponentPropsWithRef<
    T extends React.ElementType,
    Props
> = PolymorphicComponentProps<T, Props> & { ref?: PolymorphicRef<T> }

type BoxProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
    T,
    { children?: React.ReactNode }
>

type BoxComponent = React.FC & {
    <T extends React.ElementType = 'div'>(
        props: BoxProps<T>
    ): React.ReactElement | null
}

const Box: BoxComponent = forwardRef(
    <T extends React.ElementType = 'div'>(
        { as, children, ...rest }: BoxProps<T>,
        ref?: PolymorphicRef<T>
    ) => {
        const Element = as || 'div'
        return (
            <Element {...rest} ref={ref}>
                {children}
            </Element>
        )
    }
)

Box.displayName = 'Box'

export { Box }
