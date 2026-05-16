import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FileUpload from './FileUpload'

const defaultProps = {
    dragging: false,
    files: null,
    onSelectFileClick: jest.fn(),
    onDrag: jest.fn(),
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    onDragOver: jest.fn(),
    onDragEnter: jest.fn(),
    onDragLeave: jest.fn(),
    onDrop: jest.fn(),
}

describe('FileUpload', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders with default state', () => {
        render(<FileUpload {...defaultProps} />)
        expect(screen.getByText('No File Uploaded!')).toBeInTheDocument()
        expect(screen.getByText('Drag & Drop File')).toBeInTheDocument()
    })

    it('renders file names when files are provided', () => {
        const files = [
            new File(['content'], 'test.txt', { type: 'text/plain' }),
            new File(['content'], 'image.png', { type: 'image/png' }),
        ]
        const fileList = {
            ...files,
            length: files.length,
            item: (i: number) => files[i],
            [Symbol.iterator]: files[Symbol.iterator].bind(files),
        } as unknown as FileList

        render(<FileUpload {...defaultProps} files={fileList} />)
        expect(screen.getByText('test.txt')).toBeInTheDocument()
        expect(screen.getByText('image.png')).toBeInTheDocument()
    })

    it('applies dragging class when dragging', () => {
        const { container } = render(<FileUpload {...defaultProps} dragging />)
        expect(
            container.querySelector('.file-uploader--dragging')
        ).toBeInTheDocument()
    })

    it('does not apply dragging class when not dragging', () => {
        const { container } = render(<FileUpload {...defaultProps} />)
        expect(
            container.querySelector('.file-uploader--dragging')
        ).not.toBeInTheDocument()
    })

    it('calls onSelectFileClick when select file text is clicked', () => {
        render(<FileUpload {...defaultProps} />)
        fireEvent.click(screen.getByText('Select File'))
        expect(defaultProps.onSelectFileClick).toHaveBeenCalledTimes(1)
    })

    it('calls onDragEnter handler', () => {
        const { container } = render(<FileUpload {...defaultProps} />)
        const uploader = container.querySelector('.file-uploader')!
        fireEvent.dragEnter(uploader)
        expect(defaultProps.onDragEnter).toHaveBeenCalled()
    })

    it('calls onDragLeave handler', () => {
        const { container } = render(<FileUpload {...defaultProps} />)
        const uploader = container.querySelector('.file-uploader')!
        fireEvent.dragLeave(uploader)
        expect(defaultProps.onDragLeave).toHaveBeenCalled()
    })

    it('calls onDrop handler', () => {
        const { container } = render(<FileUpload {...defaultProps} />)
        const uploader = container.querySelector('.file-uploader')!
        fireEvent.drop(uploader)
        expect(defaultProps.onDrop).toHaveBeenCalled()
    })

    it('renders children', () => {
        render(
            <FileUpload {...defaultProps}>
                <input type="file" data-testid="hidden-input" />
            </FileUpload>
        )
        expect(screen.getByTestId('hidden-input')).toBeInTheDocument()
    })
})
