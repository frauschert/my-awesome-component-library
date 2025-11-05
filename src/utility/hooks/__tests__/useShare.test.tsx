import { renderHook, act, waitFor } from '@testing-library/react'
import { useShare } from '../useShare'

describe('useShare', () => {
    let originalNavigator: any

    beforeEach(() => {
        originalNavigator = global.navigator
    })

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            writable: true,
            configurable: true,
        })
        jest.clearAllMocks()
    })

    it('should return initial state', () => {
        // Mock navigator with share API
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        expect(result.current.isSharing).toBe(false)
        expect(result.current.isSupported).toBe(true)
        expect(typeof result.current.share).toBe('function')
        expect(typeof result.current.canShare).toBe('function')
    })

    it('should detect unsupported browser', () => {
        // Remove share API
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        expect(result.current.isSupported).toBe(false)
        expect(result.current.canShareFiles).toBe(false)
    })

    it('should detect file sharing support', () => {
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
                canShare: jest.fn().mockReturnValue(true),
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        expect(result.current.canShareFiles).toBe(true)
    })

    it('should share content successfully', async () => {
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        await act(async () => {
            await result.current.share({
                title: 'Test Title',
                text: 'Test Text',
                url: 'https://example.com',
            })
        })

        expect(mockShare).toHaveBeenCalledWith({
            title: 'Test Title',
            text: 'Test Text',
            url: 'https://example.com',
        })
        expect(result.current.isSharing).toBe(false)
    })

    it('should call onSuccess when share succeeds', async () => {
        const onSuccess = jest.fn()
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare({ onSuccess }))

        await act(async () => {
            await result.current.share({ title: 'Test' })
        })

        expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('should call onError when share fails', async () => {
        const onError = jest.fn()
        const error = new Error('Share failed')
        const mockShare = jest.fn().mockRejectedValue(error)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare({ onError }))

        await act(async () => {
            try {
                await result.current.share({ title: 'Test' })
            } catch (err) {
                // Expected to throw
            }
        })

        expect(onError).toHaveBeenCalledWith(error)
        expect(result.current.isSharing).toBe(false)
    })

    it('should not call onError when user cancels share (AbortError)', async () => {
        const onError = jest.fn()
        const abortError = new Error('User cancelled')
        abortError.name = 'AbortError'
        const mockShare = jest.fn().mockRejectedValue(abortError)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare({ onError }))

        await act(async () => {
            try {
                await result.current.share({ title: 'Test' })
            } catch (err) {
                // Expected to throw
            }
        })

        expect(onError).not.toHaveBeenCalled()
        expect(result.current.isSharing).toBe(false)
    })

    it('should throw error when API is not supported', async () => {
        const onError = jest.fn()
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare({ onError }))

        await act(async () => {
            try {
                await result.current.share({ title: 'Test' })
            } catch (err) {
                expect(err).toEqual(
                    new Error('Web Share API is not supported in this browser')
                )
            }
        })

        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Web Share API is not supported in this browser',
            })
        )
    })

    it('should throw error when no data is provided', async () => {
        const onError = jest.fn()
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare({ onError }))

        await act(async () => {
            try {
                await result.current.share({})
            } catch (err) {
                expect(err).toEqual(
                    new Error(
                        'Share data must contain at least one of: title, text, url, or files'
                    )
                )
            }
        })

        expect(onError).toHaveBeenCalled()
    })

    it('should share with only title', async () => {
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        await act(async () => {
            await result.current.share({ title: 'Only Title' })
        })

        expect(mockShare).toHaveBeenCalledWith({ title: 'Only Title' })
    })

    it('should share with only text', async () => {
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        await act(async () => {
            await result.current.share({ text: 'Only Text' })
        })

        expect(mockShare).toHaveBeenCalledWith({ text: 'Only Text' })
    })

    it('should share with only url', async () => {
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        await act(async () => {
            await result.current.share({ url: 'https://example.com' })
        })

        expect(mockShare).toHaveBeenCalledWith({ url: 'https://example.com' })
    })

    it('should share with files', async () => {
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        const { result } = renderHook(() => useShare())

        await act(async () => {
            await result.current.share({ files: [file] })
        })

        expect(mockShare).toHaveBeenCalledWith({ files: [file] })
    })

    it('should check if content can be shared with canShare', () => {
        const mockCanShare = jest.fn().mockReturnValue(true)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
                canShare: mockCanShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        const canShare = result.current.canShare({
            title: 'Test',
            url: 'https://example.com',
        })

        expect(canShare).toBe(true)
        expect(mockCanShare).toHaveBeenCalledWith({
            title: 'Test',
            url: 'https://example.com',
        })
    })

    it('should return false from canShare when API not supported', () => {
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        const canShare = result.current.canShare({ title: 'Test' })

        expect(canShare).toBe(false)
    })

    it('should return true from canShare when canShare not available but no files', () => {
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        const canShare = result.current.canShare({ title: 'Test' })

        expect(canShare).toBe(true)
    })

    it('should return false from canShare when canShare not available and files provided', () => {
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
            },
            writable: true,
            configurable: true,
        })

        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        const { result } = renderHook(() => useShare())

        const canShare = result.current.canShare({ files: [file] })

        expect(canShare).toBe(false)
    })

    it('should handle canShare throwing error', () => {
        const mockCanShare = jest.fn().mockImplementation(() => {
            throw new Error('canShare error')
        })
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: jest.fn(),
                canShare: mockCanShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        const canShare = result.current.canShare({ title: 'Test' })

        expect(canShare).toBe(false)
    })

    it('should set isSharing to true during share', async () => {
        let resolveFn: any
        const mockShare = jest.fn(
            () =>
                new Promise((resolve) => {
                    resolveFn = resolve
                })
        )
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const { result } = renderHook(() => useShare())

        act(() => {
            result.current.share({ title: 'Test' })
        })

        await waitFor(() => {
            expect(result.current.isSharing).toBe(true)
        })

        act(() => {
            resolveFn()
        })

        await waitFor(() => {
            expect(result.current.isSharing).toBe(false)
        })
    })

    it('should share all fields when provided', async () => {
        const mockShare = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                share: mockShare,
            },
            writable: true,
            configurable: true,
        })

        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        const { result } = renderHook(() => useShare())

        await act(async () => {
            await result.current.share({
                title: 'Title',
                text: 'Text',
                url: 'https://example.com',
                files: [file],
            })
        })

        expect(mockShare).toHaveBeenCalledWith({
            title: 'Title',
            text: 'Text',
            url: 'https://example.com',
            files: [file],
        })
    })
})
