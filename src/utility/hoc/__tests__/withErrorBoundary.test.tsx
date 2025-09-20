import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { withErrorBoundary } from '../withErrorBoundary'

const Boom: React.FC = () => {
    throw new Error('boom')
}

describe('withErrorBoundary', () => {
    const originalError = console.error
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })
    afterAll(() => {
        ;(console.error as jest.Mock).mockRestore()
        console.error = originalError
    })

    it('renders fallback when error occurs', () => {
        const Fallback = () => <div data-testid="fallback">Fallback</div>
        const Wrapped = withErrorBoundary(Boom, { fallback: <Fallback /> })
        render(<Wrapped />)
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
    })

    it('calls onError when error occurs', () => {
        const onError = jest.fn()
        const Wrapped = withErrorBoundary(Boom, { fallback: null, onError })
        render(<Wrapped />)
        expect(onError).toHaveBeenCalled()
    })
})
