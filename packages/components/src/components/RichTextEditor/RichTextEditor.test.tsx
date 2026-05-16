import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RichTextEditor from './RichTextEditor'

// Mock document.execCommand
document.execCommand = jest.fn()

// Mock window.prompt
global.prompt = jest.fn()

describe('RichTextEditor', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Basic Rendering', () => {
        it('renders with default props', () => {
            render(<RichTextEditor />)
            expect(screen.getByRole('textbox')).toBeInTheDocument()
        })

        it('renders toolbar by default', () => {
            render(<RichTextEditor />)
            expect(screen.getByRole('toolbar')).toBeInTheDocument()
        })

        it('hides toolbar when showToolbar is false', () => {
            render(<RichTextEditor showToolbar={false} />)
            expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
        })

        it('renders with custom placeholder', () => {
            render(<RichTextEditor placeholder="Custom placeholder" />)
            const editor = screen.getByRole('textbox')
            expect(editor).toHaveAttribute(
                'data-placeholder',
                'Custom placeholder'
            )
        })

        it('renders with custom className', () => {
            const { container } = render(
                <RichTextEditor className="custom-class" />
            )
            expect(container.firstChild).toHaveClass(
                'rich-text-editor',
                'custom-class'
            )
        })

        it('renders with custom id', () => {
            render(<RichTextEditor id="my-editor" />)
            expect(screen.getByRole('textbox')).toHaveAttribute(
                'id',
                'my-editor'
            )
        })
    })

    describe('Content Management', () => {
        it('renders with defaultValue', () => {
            const { container } = render(
                <RichTextEditor defaultValue="<p>Initial content</p>" />
            )
            const editor = container.querySelector('.rich-text-editor__content')
            expect(editor?.innerHTML).toBe('<p>Initial content</p>')
        })

        it('handles controlled value', () => {
            const { rerender } = render(<RichTextEditor value="<p>Test</p>" />)
            const editor = screen.getByRole('textbox')
            expect(editor.innerHTML).toBe('<p>Test</p>')

            rerender(<RichTextEditor value="<p>Updated</p>" />)
            expect(editor.innerHTML).toBe('<p>Updated</p>')
        })

        it('calls onChange when content changes', async () => {
            const handleChange = jest.fn()
            render(<RichTextEditor onChange={handleChange} />)

            const editor = screen.getByRole('textbox')
            fireEvent.input(editor)

            await waitFor(() => {
                expect(handleChange).toHaveBeenCalled()
            })
        })
    })

    describe('States', () => {
        it('applies disabled state', () => {
            render(<RichTextEditor disabled />)
            const editor = screen.getByRole('textbox')
            expect(editor).toHaveAttribute('aria-disabled', 'true')
            expect(editor).not.toHaveAttribute('contenteditable', 'true')
        })

        it('applies readonly state', () => {
            render(<RichTextEditor readOnly />)
            const editor = screen.getByRole('textbox')
            expect(editor).toHaveAttribute('aria-readonly', 'true')
            expect(editor).not.toHaveAttribute('contenteditable', 'true')
        })

        it('applies focused state on focus', () => {
            const { container } = render(<RichTextEditor />)
            const editor = screen.getByRole('textbox')

            fireEvent.focus(editor)
            expect(container.firstChild).toHaveClass(
                'rich-text-editor--focused'
            )

            fireEvent.blur(editor)
            expect(container.firstChild).not.toHaveClass(
                'rich-text-editor--focused'
            )
        })

        it('does not show toolbar when readonly', () => {
            render(<RichTextEditor readOnly />)
            expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
        })
    })

    describe('Toolbar Actions', () => {
        it('executes bold command', () => {
            render(<RichTextEditor />)
            const boldButton = screen.getByTitle('Bold')

            fireEvent.click(boldButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'bold',
                false,
                undefined
            )
        })

        it('executes italic command', () => {
            render(<RichTextEditor />)
            const italicButton = screen.getByTitle('Italic')

            fireEvent.click(italicButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'italic',
                false,
                undefined
            )
        })

        it('executes underline command', () => {
            render(<RichTextEditor />)
            const underlineButton = screen.getByTitle('Underline')

            fireEvent.click(underlineButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'underline',
                false,
                undefined
            )
        })

        it('executes strikethrough command', () => {
            render(<RichTextEditor />)
            const strikeButton = screen.getByTitle('Strikethrough')

            fireEvent.click(strikeButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'strikeThrough',
                false,
                undefined
            )
        })

        it('executes heading commands', () => {
            render(<RichTextEditor />)

            const h1Button = screen.getByTitle('Heading 1')
            fireEvent.click(h1Button)
            expect(document.execCommand).toHaveBeenCalledWith(
                'formatBlock',
                false,
                '<h1>'
            )

            const h2Button = screen.getByTitle('Heading 2')
            fireEvent.click(h2Button)
            expect(document.execCommand).toHaveBeenCalledWith(
                'formatBlock',
                false,
                '<h2>'
            )

            const h3Button = screen.getByTitle('Heading 3')
            fireEvent.click(h3Button)
            expect(document.execCommand).toHaveBeenCalledWith(
                'formatBlock',
                false,
                '<h3>'
            )
        })

        it('executes list commands', () => {
            render(<RichTextEditor />)

            const olButton = screen.getByTitle('Ordered List')
            fireEvent.click(olButton)
            expect(document.execCommand).toHaveBeenCalledWith(
                'insertOrderedList',
                false,
                undefined
            )

            const ulButton = screen.getByTitle('Unordered List')
            fireEvent.click(ulButton)
            expect(document.execCommand).toHaveBeenCalledWith(
                'insertUnorderedList',
                false,
                undefined
            )
        })

        it('executes blockquote command', () => {
            render(<RichTextEditor />)
            const blockquoteButton = screen.getByTitle('Quote')

            fireEvent.click(blockquoteButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'formatBlock',
                false,
                '<blockquote>'
            )
        })

        it('prompts for link URL', () => {
            ;(global.prompt as jest.Mock).mockReturnValue('https://example.com')
            render(<RichTextEditor />)
            const linkButton = screen.getByTitle('Insert Link')

            fireEvent.click(linkButton)

            expect(global.prompt).toHaveBeenCalledWith('Enter URL:')
            expect(document.execCommand).toHaveBeenCalledWith(
                'createLink',
                false,
                'https://example.com'
            )
        })

        it('does not insert link when prompt is cancelled', () => {
            ;(global.prompt as jest.Mock).mockReturnValue(null)
            render(<RichTextEditor />)
            const linkButton = screen.getByTitle('Insert Link')

            fireEvent.click(linkButton)

            expect(global.prompt).toHaveBeenCalled()
            expect(document.execCommand).not.toHaveBeenCalledWith(
                'createLink',
                expect.anything(),
                expect.anything()
            )
        })

        it('executes undo command', () => {
            render(<RichTextEditor />)
            const undoButton = screen.getByTitle('Undo')

            fireEvent.click(undoButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'undo',
                false,
                undefined
            )
        })

        it('executes redo command', () => {
            render(<RichTextEditor />)
            const redoButton = screen.getByTitle('Redo')

            fireEvent.click(redoButton)

            expect(document.execCommand).toHaveBeenCalledWith(
                'redo',
                false,
                undefined
            )
        })

        it('clears content', () => {
            const handleChange = jest.fn()
            const { container } = render(
                <RichTextEditor
                    defaultValue="<p>Content</p>"
                    onChange={handleChange}
                />
            )
            const clearButton = screen.getByTitle('Clear Formatting')
            const editor = container.querySelector('.rich-text-editor__content')

            fireEvent.click(clearButton)

            expect(editor?.innerHTML).toBe('')
            expect(handleChange).toHaveBeenCalled()
        })

        it('disables toolbar buttons when disabled', () => {
            render(<RichTextEditor disabled />)
            const buttons = screen.getAllByRole('button')

            buttons.forEach((button) => {
                expect(button).toBeDisabled()
            })
        })
    })

    describe('Custom Toolbar Items', () => {
        it('renders only specified toolbar items', () => {
            render(<RichTextEditor toolbarItems={['bold', 'italic', 'link']} />)

            expect(screen.getByTitle('Bold')).toBeInTheDocument()
            expect(screen.getByTitle('Italic')).toBeInTheDocument()
            expect(screen.getByTitle('Insert Link')).toBeInTheDocument()
            expect(screen.queryByTitle('Underline')).not.toBeInTheDocument()
        })
    })

    describe('Styling', () => {
        it('applies custom minHeight', () => {
            const { container } = render(<RichTextEditor minHeight="300px" />)
            const editor = container.querySelector('.rich-text-editor__content')

            expect(editor).toHaveStyle({ minHeight: '300px' })
        })

        it('applies custom maxHeight', () => {
            const { container } = render(<RichTextEditor maxHeight="500px" />)
            const editor = container.querySelector('.rich-text-editor__content')

            expect(editor).toHaveStyle({ maxHeight: '500px' })
        })

        it('applies numeric height values', () => {
            const { container } = render(
                <RichTextEditor minHeight={250} maxHeight={600} />
            )
            const editor = container.querySelector('.rich-text-editor__content')

            expect(editor).toHaveStyle({
                minHeight: '250px',
                maxHeight: '600px',
            })
        })
    })

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(<RichTextEditor ariaLabel="Custom editor label" />)
            const editor = screen.getByRole('textbox')

            expect(editor).toHaveAttribute('aria-label', 'Custom editor label')
            expect(editor).toHaveAttribute('aria-multiline', 'true')
        })

        it('toolbar has proper role and label', () => {
            render(<RichTextEditor />)
            const toolbar = screen.getByRole('toolbar')

            expect(toolbar).toHaveAttribute('aria-label', 'Text formatting')
        })

        it('toolbar buttons have proper labels', () => {
            render(<RichTextEditor />)

            expect(screen.getByLabelText('Bold')).toBeInTheDocument()
            expect(screen.getByLabelText('Italic')).toBeInTheDocument()
            expect(screen.getByLabelText('Insert Link')).toBeInTheDocument()
        })
    })

    describe('AutoFocus', () => {
        it('focuses editor when autoFocus is true', () => {
            render(<RichTextEditor autoFocus />)
            const editor = screen.getByRole('textbox')

            expect(editor).toHaveFocus()
        })
    })
})
