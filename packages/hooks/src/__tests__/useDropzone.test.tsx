import { renderHook, act } from '@testing-library/react'
import useDropzone from '../useDropzone'

// Mock File constructor for Jest environment
class MockFile {
    name: string
    size: number
    type: string

    constructor(bits: string[], name: string, options: { type: string }) {
        this.name = name
        this.size = bits.reduce(
            (acc: number, bit: string) => acc + bit.length,
            0
        )
        this.type = options.type
    }
}

global.File = MockFile as any

// Helper to create a mock File
const createFile = (name: string, size: number, type: string): MockFile => {
    const file = new MockFile(['a'.repeat(size)], name, { type })
    return file as any
}

// Helper to create mock DragEvent
const createDragEvent = (
    type: string,
    files: MockFile[] = []
): React.DragEvent<HTMLDivElement> => {
    const dataTransfer = {
        files: files as any,
        items: files.map((file) => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file,
        })),
        types: files.length > 0 ? ['Files'] : [],
        dropEffect: 'none' as const,
        effectAllowed: 'all' as const,
    }

    return {
        type,
        dataTransfer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: document.createElement('div'),
    } as any
}

describe('useDropzone', () => {
    describe('initialization', () => {
        it('should initialize with default state', () => {
            const { result } = renderHook(() => useDropzone())

            expect(result.current.isDragActive).toBe(false)
            expect(result.current.isDragAccept).toBe(false)
            expect(result.current.isDragReject).toBe(false)
            expect(result.current.acceptedFiles).toEqual([])
            expect(result.current.rejectedFiles).toEqual([])
        })

        it('should provide getRootProps and getInputProps', () => {
            const { result } = renderHook(() => useDropzone())

            expect(typeof result.current.getRootProps).toBe('function')
            expect(typeof result.current.getInputProps).toBe('function')
        })

        it('should provide open method', () => {
            const { result } = renderHook(() => useDropzone())

            expect(typeof result.current.open).toBe('function')
        })
    })

    describe('getRootProps', () => {
        it('should return root props with event handlers', () => {
            const { result } = renderHook(() => useDropzone())
            const rootProps = result.current.getRootProps()

            expect(rootProps).toHaveProperty('onDragEnter')
            expect(rootProps).toHaveProperty('onDragOver')
            expect(rootProps).toHaveProperty('onDragLeave')
            expect(rootProps).toHaveProperty('onDrop')
            expect(rootProps).toHaveProperty('onClick')
            expect(rootProps).toHaveProperty('onKeyDown')
            expect(rootProps.tabIndex).toBe(0)
            expect(rootProps.role).toBe('button')
        })

        it('should set tabIndex to -1 when disabled', () => {
            const { result } = renderHook(() => useDropzone({ disabled: true }))
            const rootProps = result.current.getRootProps()

            expect(rootProps.tabIndex).toBe(-1)
        })
    })

    describe('getInputProps', () => {
        it('should return input props', () => {
            const { result } = renderHook(() => useDropzone())
            const inputProps = result.current.getInputProps()

            expect(inputProps.type).toBe('file')
            expect(inputProps.style).toEqual({ display: 'none' })
            expect(inputProps.multiple).toBe(true)
            expect(inputProps.tabIndex).toBe(-1)
        })

        it('should set multiple to false when maxFiles is 1', () => {
            const { result } = renderHook(() => useDropzone({ maxFiles: 1 }))
            const inputProps = result.current.getInputProps()

            expect(inputProps.multiple).toBe(false)
        })

        it('should set accept attribute', () => {
            const { result } = renderHook(() =>
                useDropzone({ accept: 'image/*' })
            )
            const inputProps = result.current.getInputProps()

            expect(inputProps.accept).toBe('image/*')
        })

        it('should handle array of accept types', () => {
            const { result } = renderHook(() =>
                useDropzone({ accept: ['image/*', 'video/*'] })
            )
            const inputProps = result.current.getInputProps()

            expect(inputProps.accept).toBe('image/*,video/*')
        })
    })

    describe('drag events', () => {
        it('should set isDragActive on drag enter', () => {
            const { result } = renderHook(() => useDropzone())
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const event = createDragEvent('dragenter', [file])

            act(() => {
                rootProps.onDragEnter(event)
            })

            expect(result.current.isDragActive).toBe(true)
        })

        it('should call preventDefault and stopPropagation on drag over', () => {
            const { result } = renderHook(() => useDropzone())
            const rootProps = result.current.getRootProps()

            const event = createDragEvent('dragover')

            act(() => {
                rootProps.onDragOver(event)
            })

            expect(event.preventDefault).toHaveBeenCalled()
            expect(event.stopPropagation).toHaveBeenCalled()
        })

        it('should clear isDragActive on drag leave', () => {
            const { result } = renderHook(() => useDropzone())
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const enterEvent = createDragEvent('dragenter', [file])
            const leaveEvent = createDragEvent('dragleave')
            leaveEvent.target = enterEvent.target

            act(() => {
                rootProps.onDragEnter(enterEvent)
            })

            expect(result.current.isDragActive).toBe(true)

            act(() => {
                rootProps.onDragLeave(leaveEvent)
            })

            expect(result.current.isDragActive).toBe(false)
        })

        it('should not activate when disabled', () => {
            const { result } = renderHook(() => useDropzone({ disabled: true }))
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const event = createDragEvent('dragenter', [file])

            act(() => {
                rootProps.onDragEnter(event)
            })

            expect(result.current.isDragActive).toBe(false)
        })

        it('should not activate when noDrag is true', () => {
            const { result } = renderHook(() => useDropzone({ noDrag: true }))
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const event = createDragEvent('dragenter', [file])

            act(() => {
                rootProps.onDragEnter(event)
            })

            expect(result.current.isDragActive).toBe(false)
        })
    })

    describe('file drop', () => {
        it('should process dropped files', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() => useDropzone({ onDrop }))
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).toHaveBeenCalledWith([file])
            expect(result.current.acceptedFiles).toEqual([file])
            expect(result.current.isDragActive).toBe(false)
        })

        it('should handle multiple files', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, multiple: true })
            )
            const rootProps = result.current.getRootProps()

            const files = [
                createFile('test1.txt', 100, 'text/plain'),
                createFile('test2.txt', 200, 'text/plain'),
            ]
            const event = createDragEvent('drop', files)

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).toHaveBeenCalledWith(files)
            expect(result.current.acceptedFiles).toHaveLength(2)
        })

        it('should limit number of files with maxFiles', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, maxFiles: 2 })
            )
            const rootProps = result.current.getRootProps()

            const files = [
                createFile('test1.txt', 100, 'text/plain'),
                createFile('test2.txt', 200, 'text/plain'),
                createFile('test3.txt', 300, 'text/plain'),
            ]
            const event = createDragEvent('drop', files)

            act(() => {
                rootProps.onDrop(event)
            })

            expect(result.current.acceptedFiles).toHaveLength(2)
        })

        it('should not process files when disabled', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, disabled: true })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).not.toHaveBeenCalled()
            expect(result.current.acceptedFiles).toEqual([])
        })
    })

    describe('file validation', () => {
        it('should reject files by type', () => {
            const onDrop = jest.fn()
            const onDropRejected = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, onDropRejected, accept: 'image/*' })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('test.txt', 100, 'text/plain')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).not.toHaveBeenCalled()
            expect(onDropRejected).toHaveBeenCalledWith([file])
            expect(result.current.rejectedFiles).toEqual([file])
        })

        it('should accept files by type', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, accept: 'image/*' })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('test.jpg', 100, 'image/jpeg')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).toHaveBeenCalledWith([file])
            expect(result.current.acceptedFiles).toEqual([file])
        })

        it('should accept files by extension', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, accept: '.jpg' })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('test.jpg', 100, 'image/jpeg')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).toHaveBeenCalledWith([file])
            expect(result.current.acceptedFiles).toEqual([file])
        })

        it('should reject files exceeding maxSize', () => {
            const onDropRejected = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDropRejected, maxSize: 100 })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('large.txt', 200, 'text/plain')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDropRejected).toHaveBeenCalledWith([file])
            expect(result.current.rejectedFiles).toEqual([file])
        })

        it('should reject files below minSize', () => {
            const onDropRejected = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDropRejected, minSize: 100 })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('small.txt', 50, 'text/plain')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDropRejected).toHaveBeenCalledWith([file])
            expect(result.current.rejectedFiles).toEqual([file])
        })

        it('should accept files within size range', () => {
            const onDrop = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, minSize: 50, maxSize: 200 })
            )
            const rootProps = result.current.getRootProps()

            const file = createFile('good.txt', 100, 'text/plain')
            const event = createDragEvent('drop', [file])

            act(() => {
                rootProps.onDrop(event)
            })

            expect(onDrop).toHaveBeenCalledWith([file])
            expect(result.current.acceptedFiles).toEqual([file])
        })

        it('should separate accepted and rejected files', () => {
            const onDrop = jest.fn()
            const onDropRejected = jest.fn()
            const { result } = renderHook(() =>
                useDropzone({ onDrop, onDropRejected, accept: 'image/*' })
            )
            const rootProps = result.current.getRootProps()

            const files = [
                createFile('image.jpg', 100, 'image/jpeg'),
                createFile('doc.txt', 100, 'text/plain'),
                createFile('photo.png', 100, 'image/png'),
            ]
            const event = createDragEvent('drop', files)

            act(() => {
                rootProps.onDrop(event)
            })

            expect(result.current.acceptedFiles).toHaveLength(2)
            expect(result.current.rejectedFiles).toHaveLength(1)
            expect(onDrop).toHaveBeenCalledWith([files[0], files[2]])
            expect(onDropRejected).toHaveBeenCalledWith([files[1]])
        })
    })

    describe('click behavior', () => {
        it('should trigger click when noClick is false', () => {
            const { result } = renderHook(() => useDropzone())
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            // Mock input click
            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            act(() => {
                rootProps.onClick()
            })

            expect(inputProps.ref.current.click).toHaveBeenCalled()
        })

        it('should not trigger click when noClick is true', () => {
            const { result } = renderHook(() => useDropzone({ noClick: true }))
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            act(() => {
                rootProps.onClick()
            })

            expect(inputProps.ref.current.click).not.toHaveBeenCalled()
        })

        it('should not trigger click when disabled', () => {
            const { result } = renderHook(() => useDropzone({ disabled: true }))
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            act(() => {
                rootProps.onClick()
            })

            expect(inputProps.ref.current.click).not.toHaveBeenCalled()
        })
    })

    describe('keyboard behavior', () => {
        it('should trigger click on Enter key', () => {
            const { result } = renderHook(() => useDropzone())
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            const event = {
                key: 'Enter',
                preventDefault: jest.fn(),
            } as any

            act(() => {
                rootProps.onKeyDown(event)
            })

            expect(event.preventDefault).toHaveBeenCalled()
            expect(inputProps.ref.current.click).toHaveBeenCalled()
        })

        it('should trigger click on Space key', () => {
            const { result } = renderHook(() => useDropzone())
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            const event = {
                key: ' ',
                preventDefault: jest.fn(),
            } as any

            act(() => {
                rootProps.onKeyDown(event)
            })

            expect(event.preventDefault).toHaveBeenCalled()
            expect(inputProps.ref.current.click).toHaveBeenCalled()
        })

        it('should not trigger on other keys', () => {
            const { result } = renderHook(() => useDropzone())
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            const event = {
                key: 'a',
                preventDefault: jest.fn(),
            } as any

            act(() => {
                rootProps.onKeyDown(event)
            })

            expect(inputProps.ref.current.click).not.toHaveBeenCalled()
        })

        it('should not trigger when noKeyboard is true', () => {
            const { result } = renderHook(() =>
                useDropzone({ noKeyboard: true })
            )
            const inputProps = result.current.getInputProps()
            const rootProps = result.current.getRootProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            const event = {
                key: 'Enter',
                preventDefault: jest.fn(),
            } as any

            act(() => {
                rootProps.onKeyDown(event)
            })

            expect(inputProps.ref.current.click).not.toHaveBeenCalled()
        })
    })

    describe('open method', () => {
        it('should trigger file input click', () => {
            const { result } = renderHook(() => useDropzone())
            const inputProps = result.current.getInputProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            act(() => {
                result.current.open()
            })

            expect(inputProps.ref.current.click).toHaveBeenCalled()
        })

        it('should not trigger when disabled', () => {
            const { result } = renderHook(() => useDropzone({ disabled: true }))
            const inputProps = result.current.getInputProps()

            inputProps.ref.current = {
                click: jest.fn(),
            } as any

            act(() => {
                result.current.open()
            })

            expect(inputProps.ref.current.click).not.toHaveBeenCalled()
        })
    })
})
