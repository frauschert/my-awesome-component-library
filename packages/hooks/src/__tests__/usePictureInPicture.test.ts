import { act, renderHook } from '@testing-library/react'
import { createRef } from 'react'
import usePictureInPicture from '../usePictureInPicture'

type MockPictureInPictureWindow = {
    width: number
    height: number
}

const originalPictureInPictureEnabled = Object.getOwnPropertyDescriptor(
    document,
    'pictureInPictureEnabled'
)
const originalPictureInPictureElement = Object.getOwnPropertyDescriptor(
    document,
    'pictureInPictureElement'
)
const originalExitPictureInPicture = Object.getOwnPropertyDescriptor(
    document,
    'exitPictureInPicture'
)

let activePictureInPictureElement: HTMLVideoElement | null

function definePictureInPictureDocumentSupport(enabled = true) {
    Object.defineProperty(document, 'pictureInPictureEnabled', {
        value: enabled,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(document, 'pictureInPictureElement', {
        get: () => activePictureInPictureElement,
        configurable: true,
    })

    Object.defineProperty(document, 'exitPictureInPicture', {
        value: jest.fn(async () => {
            const current = activePictureInPictureElement
            activePictureInPictureElement = null

            if (current) {
                current.dispatchEvent(new Event('leavepictureinpicture'))
            }
        }),
        configurable: true,
        writable: true,
    })
}

function createMockVideoElement(pipWindow?: MockPictureInPictureWindow) {
    const video = document.createElement('video') as HTMLVideoElement & {
        requestPictureInPicture?: jest.Mock<
            Promise<MockPictureInPictureWindow>,
            []
        >
        disablePictureInPicture?: boolean
    }

    video.requestPictureInPicture = jest.fn(async () => {
        activePictureInPictureElement = video

        const event = new Event('enterpictureinpicture') as Event & {
            pictureInPictureWindow?: MockPictureInPictureWindow
        }

        event.pictureInPictureWindow = pipWindow
        video.dispatchEvent(event)

        return pipWindow ?? { width: 320, height: 180 }
    })

    return video
}

beforeEach(() => {
    activePictureInPictureElement = null
    definePictureInPictureDocumentSupport(true)
})

afterEach(() => {
    if (originalPictureInPictureEnabled) {
        Object.defineProperty(
            document,
            'pictureInPictureEnabled',
            originalPictureInPictureEnabled
        )
    } else {
        delete (document as Document & { pictureInPictureEnabled?: unknown })
            .pictureInPictureEnabled
    }

    if (originalPictureInPictureElement) {
        Object.defineProperty(
            document,
            'pictureInPictureElement',
            originalPictureInPictureElement
        )
    } else {
        delete (document as Document & { pictureInPictureElement?: unknown })
            .pictureInPictureElement
    }

    if (originalExitPictureInPicture) {
        Object.defineProperty(
            document,
            'exitPictureInPicture',
            originalExitPictureInPicture
        )
    } else {
        delete (document as Document & { exitPictureInPicture?: unknown })
            .exitPictureInPicture
    }

    jest.clearAllMocks()
})

describe('usePictureInPicture', () => {
    it('initialises with idle state', () => {
        const videoRef = createRef<HTMLVideoElement>()
        videoRef.current = createMockVideoElement()

        const { result } = renderHook(() => usePictureInPicture(videoRef))

        expect(result.current.isPictureInPicture).toBe(false)
        expect(result.current.pictureInPictureWindow).toBe(null)
        expect(result.current.error).toBe(null)
        expect(result.current.isSupported).toBe(true)
    })

    it('enters picture-in-picture and captures window dimensions', async () => {
        const onEnter = jest.fn()
        const videoRef = createRef<HTMLVideoElement>()
        videoRef.current = createMockVideoElement({ width: 640, height: 360 })

        const { result } = renderHook(() =>
            usePictureInPicture(videoRef, { onEnter })
        )

        await act(async () => {
            await result.current.enter()
        })

        expect(result.current.isPictureInPicture).toBe(true)
        expect(result.current.pictureInPictureWindow).toEqual({
            width: 640,
            height: 360,
        })
        expect(onEnter).toHaveBeenCalledWith({ width: 640, height: 360 })
    })

    it('exits picture-in-picture and calls onExit', async () => {
        const onExit = jest.fn()
        const videoRef = createRef<HTMLVideoElement>()
        videoRef.current = createMockVideoElement({ width: 320, height: 180 })

        const { result } = renderHook(() =>
            usePictureInPicture(videoRef, { onExit })
        )

        await act(async () => {
            await result.current.enter()
        })

        await act(async () => {
            await result.current.exit()
        })

        expect(result.current.isPictureInPicture).toBe(false)
        expect(result.current.pictureInPictureWindow).toBe(null)
        expect(onExit).toHaveBeenCalledTimes(1)
        expect(document.exitPictureInPicture).toHaveBeenCalledTimes(1)
    })

    it('toggles picture-in-picture mode', async () => {
        const videoRef = createRef<HTMLVideoElement>()
        videoRef.current = createMockVideoElement({ width: 500, height: 300 })

        const { result } = renderHook(() => usePictureInPicture(videoRef))

        await act(async () => {
            await result.current.toggle()
        })

        expect(result.current.isPictureInPicture).toBe(true)

        await act(async () => {
            await result.current.toggle()
        })

        expect(result.current.isPictureInPicture).toBe(false)
    })

    it('surfaces unsupported browsers and unattached refs', async () => {
        Object.defineProperty(document, 'pictureInPictureEnabled', {
            value: false,
            configurable: true,
            writable: true,
        })

        const unsupportedRef = createRef<HTMLVideoElement>()
        unsupportedRef.current = createMockVideoElement()
        const unsupportedOnError = jest.fn()

        const { result: unsupportedResult } = renderHook(() =>
            usePictureInPicture(unsupportedRef, { onError: unsupportedOnError })
        )

        await act(async () => {
            await unsupportedResult.current.enter()
        })

        expect(unsupportedResult.current.isSupported).toBe(false)
        expect(unsupportedResult.current.error?.message).toBe(
            'Picture-in-Picture is not supported by this browser'
        )
        expect(unsupportedOnError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Picture-in-Picture is not supported by this browser',
            })
        )

        definePictureInPictureDocumentSupport(true)

        const unattachedRef = createRef<HTMLVideoElement>()
        const unattachedOnError = jest.fn()

        const { result: unattachedResult } = renderHook(() =>
            usePictureInPicture(unattachedRef, { onError: unattachedOnError })
        )

        await act(async () => {
            await unattachedResult.current.enter()
        })

        expect(unattachedResult.current.error?.message).toBe(
            'Video ref is not attached'
        )
        expect(unattachedOnError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Video ref is not attached' })
        )
    })

    it('surfaces request failures', async () => {
        const onError = jest.fn()
        const video = createMockVideoElement()
        video.requestPictureInPicture = jest.fn(async () => {
            throw new Error('request failed')
        })

        const videoRef = createRef<HTMLVideoElement>()
        videoRef.current = video

        const { result } = renderHook(() =>
            usePictureInPicture(videoRef, { onError })
        )

        await act(async () => {
            await result.current.enter()
        })

        expect(result.current.error?.message).toBe('request failed')
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'request failed' })
        )
    })
})
