import { renderHook, act, waitFor } from '@testing-library/react'
import useCopyToClipboard from '../useCopyToClipboard'

describe('useCopyToClipboard', () => {
    let mockClipboard: {
        writeText: jest.Mock
    }

    beforeEach(() => {
        mockClipboard = {
            writeText: jest.fn(),
        }

        Object.defineProperty(navigator, 'clipboard', {
            writable: true,
            value: mockClipboard,
            configurable: true,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useCopyToClipboard())

        expect(result.current.copiedText).toBeNull()
        expect(result.current.isSuccess).toBe(false)
        expect(result.current.isCopying).toBe(false)
        expect(result.current.error).toBeNull()
        expect(typeof result.current.copy).toBe('function')
        expect(typeof result.current.reset).toBe('function')
    })

    it('should copy text successfully using Clipboard API', async () => {
        mockClipboard.writeText.mockResolvedValue(undefined)

        const { result } = renderHook(() => useCopyToClipboard())

        let copyResult: boolean | undefined
        await act(async () => {
            copyResult = await result.current.copy('Hello World')
        })

        expect(copyResult).toBe(true)
        expect(mockClipboard.writeText).toHaveBeenCalledWith('Hello World')
        expect(result.current.copiedText).toBe('Hello World')
        expect(result.current.isSuccess).toBe(true)
        expect(result.current.isCopying).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('should set isCopying to true during copy operation', async () => {
        mockClipboard.writeText.mockImplementation(
            () =>
                new Promise((resolve) => {
                    setTimeout(resolve, 100)
                })
        )

        const { result } = renderHook(() => useCopyToClipboard())

        act(() => {
            result.current.copy('Test text')
        })

        // Should be copying immediately
        expect(result.current.isCopying).toBe(true)

        await waitFor(() => {
            expect(result.current.isCopying).toBe(false)
        })
    })

    it('should handle copy failure', async () => {
        const error = new Error('Clipboard access denied')
        mockClipboard.writeText.mockRejectedValue(error)

        const { result } = renderHook(() => useCopyToClipboard())

        let copyResult: boolean | undefined
        await act(async () => {
            copyResult = await result.current.copy('Test')
        })

        expect(copyResult).toBe(false)
        expect(result.current.isSuccess).toBe(false)
        expect(result.current.isCopying).toBe(false)
        expect(result.current.error).toEqual(error)
        expect(result.current.copiedText).toBeNull()
    })

    it('should handle empty text', async () => {
        const { result } = renderHook(() => useCopyToClipboard())

        let copyResult: boolean | undefined
        await act(async () => {
            copyResult = await result.current.copy('')
        })

        expect(copyResult).toBe(false)
        expect(result.current.error?.message).toBe('No text provided')
        expect(result.current.isSuccess).toBe(false)
        expect(mockClipboard.writeText).not.toHaveBeenCalled()
    })

    it('should reset state', async () => {
        mockClipboard.writeText.mockResolvedValue(undefined)

        const { result } = renderHook(() => useCopyToClipboard())

        // Copy text
        await act(async () => {
            await result.current.copy('Test')
        })

        expect(result.current.isSuccess).toBe(true)
        expect(result.current.copiedText).toBe('Test')

        // Reset
        act(() => {
            result.current.reset()
        })

        expect(result.current.copiedText).toBeNull()
        expect(result.current.isSuccess).toBe(false)
        expect(result.current.isCopying).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('should update copiedText on subsequent copies', async () => {
        mockClipboard.writeText.mockResolvedValue(undefined)

        const { result } = renderHook(() => useCopyToClipboard())

        // First copy
        await act(async () => {
            await result.current.copy('First')
        })

        expect(result.current.copiedText).toBe('First')

        // Second copy
        await act(async () => {
            await result.current.copy('Second')
        })

        expect(result.current.copiedText).toBe('Second')
        expect(result.current.isSuccess).toBe(true)
    })

    it('should handle special characters', async () => {
        mockClipboard.writeText.mockResolvedValue(undefined)

        const { result } = renderHook(() => useCopyToClipboard())

        const specialText = 'Hello\n\tWorld\r\n"quotes" & <html>'
        await act(async () => {
            await result.current.copy(specialText)
        })

        expect(mockClipboard.writeText).toHaveBeenCalledWith(specialText)
        expect(result.current.copiedText).toBe(specialText)
        expect(result.current.isSuccess).toBe(true)
    })

    it('should handle long text', async () => {
        mockClipboard.writeText.mockResolvedValue(undefined)

        const { result } = renderHook(() => useCopyToClipboard())

        const longText = 'A'.repeat(10000)
        await act(async () => {
            await result.current.copy(longText)
        })

        expect(mockClipboard.writeText).toHaveBeenCalledWith(longText)
        expect(result.current.copiedText).toBe(longText)
        expect(result.current.isSuccess).toBe(true)
    })

    it('should handle unicode characters', async () => {
        mockClipboard.writeText.mockResolvedValue(undefined)

        const { result } = renderHook(() => useCopyToClipboard())

        const unicodeText = '你好世界 🌍 émojis ñ'
        await act(async () => {
            await result.current.copy(unicodeText)
        })

        expect(mockClipboard.writeText).toHaveBeenCalledWith(unicodeText)
        expect(result.current.copiedText).toBe(unicodeText)
    })

    describe('fallback to execCommand', () => {
        beforeEach(() => {
            // Remove Clipboard API
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                value: undefined,
                configurable: true,
            })

            // Mock document methods
            document.execCommand = jest.fn()
            document.body.appendChild = jest.fn()
            document.body.removeChild = jest.fn()
        })

        it('should fallback to execCommand when Clipboard API is not available', async () => {
            const container = document.createElement('div')
            document.body.appendChild(container)
            ;(document.execCommand as jest.Mock).mockReturnValue(true)

            const { result } = renderHook(() => useCopyToClipboard(), {
                container,
            })

            let copyResult: boolean | undefined
            await act(async () => {
                copyResult = await result.current.copy('Fallback text')
            })

            expect(copyResult).toBe(true)
            expect(document.execCommand).toHaveBeenCalledWith('copy')
            expect(result.current.copiedText).toBe('Fallback text')
            expect(result.current.isSuccess).toBe(true)

            document.body.removeChild(container)
        })

        it('should handle execCommand failure', async () => {
            const container = document.createElement('div')
            document.body.appendChild(container)
            ;(document.execCommand as jest.Mock).mockReturnValue(false)

            const { result } = renderHook(() => useCopyToClipboard(), {
                container,
            })

            let copyResult: boolean | undefined
            await act(async () => {
                copyResult = await result.current.copy('Test')
            })

            expect(copyResult).toBe(false)
            expect(result.current.isSuccess).toBe(false)
            expect(result.current.error).toBeTruthy()

            document.body.removeChild(container)
        })
    })

    describe('practical use cases', () => {
        beforeEach(() => {
            mockClipboard.writeText.mockResolvedValue(undefined)
        })

        it('should work for code snippets', async () => {
            const container = document.createElement('div')
            document.body.appendChild(container)

            const { result } = renderHook(() => useCopyToClipboard(), {
                container,
            })

            const code = `function example() {\n  return 'Hello World'\n}`
            await act(async () => {
                await result.current.copy(code)
            })

            expect(result.current.copiedText).toBe(code)
            expect(result.current.isSuccess).toBe(true)

            document.body.removeChild(container)
        })

        it('should work for URLs', async () => {
            const container = document.createElement('div')
            document.body.appendChild(container)

            const { result } = renderHook(() => useCopyToClipboard(), {
                container,
            })

            const url = 'https://example.com/path?query=value&foo=bar'
            await act(async () => {
                await result.current.copy(url)
            })

            expect(result.current.copiedText).toBe(url)
            expect(result.current.isSuccess).toBe(true)

            document.body.removeChild(container)
        })

        it('should work for JSON data', async () => {
            const container = document.createElement('div')
            document.body.appendChild(container)

            const { result } = renderHook(() => useCopyToClipboard(), {
                container,
            })

            const json = JSON.stringify({ name: 'John', age: 30 }, null, 2)
            await act(async () => {
                await result.current.copy(json)
            })

            expect(result.current.copiedText).toBe(json)
            expect(result.current.isSuccess).toBe(true)

            document.body.removeChild(container)
        })

        it('should work for email addresses', async () => {
            const container = document.createElement('div')
            document.body.appendChild(container)

            const { result } = renderHook(() => useCopyToClipboard(), {
                container,
            })

            const email = 'user@example.com'
            await act(async () => {
                await result.current.copy(email)
            })

            expect(result.current.copiedText).toBe(email)
            expect(result.current.isSuccess).toBe(true)

            document.body.removeChild(container)
        })
    })
})
