import React from 'react'
import { render, screen } from '@testing-library/react'
import Ellipsis from './Ellipsis'

describe('Ellipsis', () => {
    test('renders Ellipsis component', () => {
        render(<Ellipsis />)

        expect(screen.getByRole('spinner')).toBeInTheDocument()
    })
})
