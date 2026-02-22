import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagsInput from './TagsInput'

describe('TagsInput', () => {
    test('renders with label and placeholder', () => {
        render(<TagsInput label="Tags" placeholder="Type here" />)
        expect(screen.getByLabelText('Tags')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
    })

    test('renders default tags from defaultValue', () => {
        render(<TagsInput defaultValue={['React', 'Vue']} />)
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Vue')).toBeInTheDocument()
    })

    test('adds tag on Enter key', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<TagsInput onChange={onChange} />)

        const input = screen.getByRole('textbox')
        await user.type(input, 'TypeScript{Enter}')

        expect(screen.getByText('TypeScript')).toBeInTheDocument()
        expect(onChange).toHaveBeenCalledWith(['TypeScript'])
    })

    test('adds tag on comma separator', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<TagsInput onChange={onChange} />)

        const input = screen.getByRole('textbox')
        await user.type(input, 'React,')

        expect(screen.getByText('React')).toBeInTheDocument()
        expect(onChange).toHaveBeenCalledWith(['React'])
    })

    test('removes tag via dismiss button', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<TagsInput defaultValue={['A', 'B', 'C']} onChange={onChange} />)

        const removeB = screen.getByRole('button', { name: 'Remove B' })
        await user.click(removeB)

        expect(screen.queryByText('B')).not.toBeInTheDocument()
        expect(onChange).toHaveBeenCalledWith(['A', 'C'])
    })

    test('removes last tag on Backspace when input is empty', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<TagsInput defaultValue={['X', 'Y']} onChange={onChange} />)

        const input = screen.getByRole('textbox')
        await user.click(input)
        await user.keyboard('{Backspace}')

        expect(screen.queryByText('Y')).not.toBeInTheDocument()
        expect(onChange).toHaveBeenCalledWith(['X'])
    })

    test('prevents duplicate tags by default', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<TagsInput defaultValue={['React']} onChange={onChange} />)

        const input = screen.getByRole('textbox')
        await user.type(input, 'React{Enter}')

        // onChange should not have been called since duplicate is rejected
        expect(onChange).not.toHaveBeenCalled()
    })

    test('allows duplicates when allowDuplicates is true', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(
            <TagsInput
                defaultValue={['React']}
                allowDuplicates
                onChange={onChange}
            />
        )

        const input = screen.getByRole('textbox')
        await user.type(input, 'React{Enter}')

        expect(onChange).toHaveBeenCalledWith(['React', 'React'])
        expect(screen.getAllByText('React')).toHaveLength(2)
    })

    test('respects maxTags limit', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(
            <TagsInput
                defaultValue={['A', 'B']}
                maxTags={2}
                onChange={onChange}
            />
        )

        const input = screen.getByRole('textbox')
        await user.type(input, 'C{Enter}')

        expect(screen.queryByText('C')).not.toBeInTheDocument()
        expect(onChange).not.toHaveBeenCalled()
    })

    test('rejects tags that fail validation', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        const validate = (tag: string) => tag.length >= 2
        render(<TagsInput validate={validate} onChange={onChange} />)

        const input = screen.getByRole('textbox')
        await user.type(input, 'A{Enter}')

        // Single char rejected
        expect(onChange).not.toHaveBeenCalled()

        await user.clear(input)
        await user.type(input, 'AB{Enter}')
        expect(onChange).toHaveBeenCalledWith(['AB'])
    })

    test('controlled mode uses value prop', async () => {
        const onChange = jest.fn()
        const { rerender } = render(
            <TagsInput value={['controlled']} onChange={onChange} />
        )

        expect(screen.getByText('controlled')).toBeInTheDocument()

        // Re-render with updated value
        rerender(
            <TagsInput value={['controlled', 'new']} onChange={onChange} />
        )
        expect(screen.getByText('new')).toBeInTheDocument()
    })

    test('renders error text and aria-invalid', () => {
        render(<TagsInput errorText="Required field" />)
        expect(screen.getByText('Required field')).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'aria-invalid',
            'true'
        )
    })

    test('renders helper text', () => {
        render(<TagsInput helperText="Separate with commas" />)
        expect(screen.getByText('Separate with commas')).toBeInTheDocument()
    })

    test('error text replaces helper text', () => {
        render(<TagsInput helperText="hint" errorText="error!" />)
        expect(screen.getByText('error!')).toBeInTheDocument()
        expect(screen.queryByText('hint')).not.toBeInTheDocument()
    })

    test('disabled state prevents interaction', async () => {
        render(<TagsInput disabled defaultValue={['Tag']} />)

        const input = screen.getByRole('textbox')
        expect(input).toBeDisabled()
        // No remove buttons when disabled
        expect(
            screen.queryByRole('button', { name: 'Remove Tag' })
        ).not.toBeInTheDocument()
    })

    test('handles paste with separator splitting', () => {
        const onChange = jest.fn()
        render(<TagsInput onChange={onChange} />)

        const input = screen.getByRole('textbox')
        fireEvent.paste(input, {
            clipboardData: { getData: () => 'foo,bar,baz' },
        })

        expect(screen.getByText('foo')).toBeInTheDocument()
        expect(screen.getByText('bar')).toBeInTheDocument()
        expect(screen.getByText('baz')).toBeInTheDocument()
    })

    test('applies size variant class', () => {
        const { container } = render(<TagsInput sizeVariant="lg" />)
        expect(container.firstChild).toHaveClass('tags-input--lg')
    })

    test('applies custom className', () => {
        const { container } = render(<TagsInput className="custom" />)
        expect(container.firstChild).toHaveClass('custom')
    })
})
