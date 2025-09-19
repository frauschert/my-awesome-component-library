import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { withClickOutside } from '../withClickOutside'

const Base: React.FC<{ onOutsideClick?: (e: MouseEvent) => void }> = () => (
    <div data-testid="inside">Inside</div>
)

describe('withClickOutside', () => {
    it('calls handler on outside click', () => {
        const onOutsideClick = jest.fn()
        const Wrapped = withClickOutside(Base)
        render(
            <div>
                <Wrapped onOutsideClick={onOutsideClick} />
                <div data-testid="outside">Outside</div>
            </div>
        )

        fireEvent.pointerDown(screen.getByTestId('outside'))
        expect(onOutsideClick).toHaveBeenCalled()
    })

    it('does not call handler on inside click', () => {
        const onOutsideClick = jest.fn()
        const Wrapped = withClickOutside(Base)
        render(<Wrapped onOutsideClick={onOutsideClick} />)

        fireEvent.pointerDown(screen.getByTestId('inside'))
        expect(onOutsideClick).not.toHaveBeenCalled()
    })
})
