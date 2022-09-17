import React from 'react'
import { render, screen } from '@testing-library/react'
import { inject, withInjectedProps } from '../inject'

type TestComponentProps = { name: string; age: number }
function TestComponent({ name, age }: TestComponentProps) {
    return (
        <div role="heading">
            <div>{name}</div>
            <div>{age}</div>
        </div>
    )
}

describe('withInjectedProps', () => {
    test('renders injected component', () => {
        const WithName = withInjectedProps({ name: 'Peter' })(TestComponent)
        render(<WithName age={20} />)

        const result = screen.getByRole('heading')
        expect(result).toHaveTextContent('Peter')
    })
})

describe('injected', () => {
    test('renders injected component', () => {
        const WithName = inject(TestComponent, { name: 'Peter' })
        render(<WithName age={20} />)

        const result = screen.getByRole('heading')
        expect(result).toHaveTextContent('Peter')
    })
})
