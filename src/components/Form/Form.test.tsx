import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Form from './Form'
import FormGroup from './FormGroup'
import FormActions from './FormActions'

describe('Form', () => {
    it('renders children', () => {
        render(
            <Form>
                <input type="text" placeholder="Test input" />
            </Form>
        )
        expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument()
    })

    it('calls onSubmit when form is submitted', () => {
        const handleSubmit = jest.fn((e) => e.preventDefault())
        render(
            <Form onSubmit={handleSubmit}>
                <input type="text" name="test" required defaultValue="test" />
                <button type="submit">Submit</button>
            </Form>
        )

        fireEvent.click(screen.getByText('Submit'))
        expect(handleSubmit).toHaveBeenCalled()
    })

    it('applies vertical layout by default', () => {
        const { container } = render(
            <Form>
                <input type="text" />
            </Form>
        )
        expect(container.querySelector('.form--vertical')).toBeInTheDocument()
    })

    it('applies horizontal layout', () => {
        const { container } = render(
            <Form layout="horizontal">
                <input type="text" />
            </Form>
        )
        expect(container.querySelector('.form--horizontal')).toBeInTheDocument()
    })

    it('applies inline layout', () => {
        const { container } = render(
            <Form layout="inline">
                <input type="text" />
            </Form>
        )
        expect(container.querySelector('.form--inline')).toBeInTheDocument()
    })

    it('applies size classes', () => {
        const { container } = render(
            <Form size="lg">
                <input type="text" />
            </Form>
        )
        expect(container.querySelector('.form--lg')).toBeInTheDocument()
    })

    it('applies disabled state', () => {
        render(
            <Form disabled>
                <input type="text" data-testid="input" />
            </Form>
        )
        expect(screen.getByTestId('input')).toBeDisabled()
    })

    it('applies custom className', () => {
        const { container } = render(
            <Form className="custom-form">
                <input type="text" />
            </Form>
        )
        expect(container.querySelector('.custom-form')).toBeInTheDocument()
    })

    it('applies ARIA attributes', () => {
        const { container } = render(
            <Form aria-label="Contact form">
                <input type="text" />
            </Form>
        )
        const form = container.querySelector('form')
        expect(form).toHaveAttribute('aria-label', 'Contact form')
    })

    it('calls onError when form is invalid', () => {
        const handleError = jest.fn()
        render(
            <Form onError={handleError}>
                <input
                    type="email"
                    name="email"
                    defaultValue="invalid"
                    required
                />
                <button type="submit">Submit</button>
            </Form>
        )

        fireEvent.click(screen.getByText('Submit'))
        expect(handleError).toHaveBeenCalled()
    })
})

describe('FormGroup', () => {
    it('renders children', () => {
        render(
            <FormGroup>
                <input type="text" placeholder="Test" />
            </FormGroup>
        )
        expect(screen.getByPlaceholderText('Test')).toBeInTheDocument()
    })

    it('renders label', () => {
        render(
            <FormGroup label="Email">
                <input type="email" />
            </FormGroup>
        )
        expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders required indicator', () => {
        render(
            <FormGroup label="Email" required>
                <input type="email" />
            </FormGroup>
        )
        expect(screen.getByLabelText('required')).toBeInTheDocument()
    })

    it('renders description', () => {
        render(
            <FormGroup description="Enter your email address">
                <input type="email" />
            </FormGroup>
        )
        expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })

    it('renders error message', () => {
        render(
            <FormGroup error="Email is required">
                <input type="email" />
            </FormGroup>
        )
        expect(screen.getByText('Email is required')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders hint text when no error', () => {
        render(
            <FormGroup hint="We'll never share your email">
                <input type="email" />
            </FormGroup>
        )
        expect(
            screen.getByText("We'll never share your email")
        ).toBeInTheDocument()
    })

    it('does not render hint when error is present', () => {
        render(
            <FormGroup error="Email is required" hint="Hint text">
                <input type="email" />
            </FormGroup>
        )
        expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
        expect(screen.getByText('Email is required')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <FormGroup className="custom-group">
                <input type="text" />
            </FormGroup>
        )
        expect(container.querySelector('.custom-group')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
        render(
            <FormGroup label="Username" htmlFor="username-input">
                <input type="text" id="username-input" />
            </FormGroup>
        )
        const label = screen.getByText('Username')
        expect(label).toHaveAttribute('for', 'username-input')
    })
})

describe('FormActions', () => {
    it('renders children', () => {
        render(
            <FormActions>
                <button>Submit</button>
                <button>Cancel</button>
            </FormActions>
        )
        expect(screen.getByText('Submit')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('applies right alignment by default', () => {
        const { container } = render(
            <FormActions>
                <button>Submit</button>
            </FormActions>
        )
        expect(
            container.querySelector('.form-actions--right')
        ).toBeInTheDocument()
    })

    it('applies left alignment', () => {
        const { container } = render(
            <FormActions align="left">
                <button>Submit</button>
            </FormActions>
        )
        expect(
            container.querySelector('.form-actions--left')
        ).toBeInTheDocument()
    })

    it('applies center alignment', () => {
        const { container } = render(
            <FormActions align="center">
                <button>Submit</button>
            </FormActions>
        )
        expect(
            container.querySelector('.form-actions--center')
        ).toBeInTheDocument()
    })

    it('applies space-between alignment', () => {
        const { container } = render(
            <FormActions align="space-between">
                <button>Submit</button>
            </FormActions>
        )
        expect(
            container.querySelector('.form-actions--space-between')
        ).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <FormActions className="custom-actions">
                <button>Submit</button>
            </FormActions>
        )
        expect(container.querySelector('.custom-actions')).toBeInTheDocument()
    })
})
