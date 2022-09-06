import React from 'react'
import { render, screen } from '@testing-library/react'
import SpinCoin from './SpinCoin'

describe('SpinCoin', () => {
    test('renders SpinCoin component', () => {
        render(<SpinCoin />)

        expect(screen.getByRole('spinner')).toBeInTheDocument()
    })
})
