import { act, renderHook, waitFor } from '@testing-library/react'
import useMediaDevices from '../useMediaDevices'

type MockDevice = {
    deviceId: string
    groupId: string
    kind: 'audioinput' | 'audiooutput' | 'videoinput'
    label: string
}

type DeviceChangeListener = () => void

class MockMediaDevices {
    devices: MockDevice[] = []
    enumerateDevices = jest.fn(async () => this.devices)
    addEventListener = jest.fn(
        (_event: 'devicechange', listener: DeviceChangeListener) => {
            this.listeners.add(listener)
        }
    )
    removeEventListener = jest.fn(
        (_event: 'devicechange', listener: DeviceChangeListener) => {
            this.listeners.delete(listener)
        }
    )

    private listeners = new Set<DeviceChangeListener>()

    emitDeviceChange() {
        this.listeners.forEach((listener) => listener())
    }
}

const originalMediaDevices = navigator.mediaDevices

let mockMediaDevices: MockMediaDevices

beforeEach(() => {
    mockMediaDevices = new MockMediaDevices()

    Object.defineProperty(navigator, 'mediaDevices', {
        value: mockMediaDevices,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
        value: originalMediaDevices,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useMediaDevices', () => {
    it('enumerates devices on mount and groups them by kind', async () => {
        mockMediaDevices.devices = [
            {
                deviceId: 'mic-1',
                groupId: 'group-1',
                kind: 'audioinput',
                label: 'Microphone',
            },
            {
                deviceId: 'speaker-1',
                groupId: 'group-1',
                kind: 'audiooutput',
                label: 'Speakers',
            },
            {
                deviceId: 'camera-1',
                groupId: 'group-2',
                kind: 'videoinput',
                label: 'Camera',
            },
        ]

        const { result } = renderHook(() => useMediaDevices())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.devices).toHaveLength(3)
        })

        expect(result.current.audioInputs).toEqual([
            {
                deviceId: 'mic-1',
                groupId: 'group-1',
                kind: 'audioinput',
                label: 'Microphone',
            },
        ])
        expect(result.current.audioOutputs).toEqual([
            {
                deviceId: 'speaker-1',
                groupId: 'group-1',
                kind: 'audiooutput',
                label: 'Speakers',
            },
        ])
        expect(result.current.videoInputs).toEqual([
            {
                deviceId: 'camera-1',
                groupId: 'group-2',
                kind: 'videoinput',
                label: 'Camera',
            },
        ])
    })

    it('supports manual refresh and calls onChange', async () => {
        const onChange = jest.fn()
        const { result } = renderHook(() =>
            useMediaDevices({ immediate: false, onChange })
        )

        expect(result.current.loading).toBe(false)
        expect(result.current.devices).toEqual([])

        mockMediaDevices.devices = [
            {
                deviceId: 'mic-2',
                groupId: 'group-3',
                kind: 'audioinput',
                label: 'USB Mic',
            },
        ]

        let returnedDevices: Awaited<
            ReturnType<typeof result.current.refresh>
        > = []

        await act(async () => {
            returnedDevices = await result.current.refresh()
        })

        expect(returnedDevices).toEqual([
            {
                deviceId: 'mic-2',
                groupId: 'group-3',
                kind: 'audioinput',
                label: 'USB Mic',
            },
        ])
        expect(result.current.devices).toEqual(returnedDevices)
        expect(onChange).toHaveBeenCalledWith(returnedDevices)
    })

    it('refreshes automatically when the device list changes', async () => {
        mockMediaDevices.devices = [
            {
                deviceId: 'camera-1',
                groupId: 'group-1',
                kind: 'videoinput',
                label: 'Front Camera',
            },
        ]

        const { result } = renderHook(() => useMediaDevices())

        await waitFor(() => {
            expect(result.current.devices).toHaveLength(1)
        })

        act(() => {
            mockMediaDevices.devices = [
                {
                    deviceId: 'camera-1',
                    groupId: 'group-1',
                    kind: 'videoinput',
                    label: 'Front Camera',
                },
                {
                    deviceId: 'camera-2',
                    groupId: 'group-2',
                    kind: 'videoinput',
                    label: 'Rear Camera',
                },
            ]
            mockMediaDevices.emitDeviceChange()
        })

        await waitFor(() => {
            expect(result.current.videoInputs).toHaveLength(2)
        })
    })

    it('reports unsupported browsers', () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const { result } = renderHook(() => useMediaDevices())

        expect(result.current.isSupported).toBe(false)
        expect(result.current.loading).toBe(false)
    })

    it('stores enumeration errors and calls onError', async () => {
        const enumerateError = new Error('Permission denied')
        const onError = jest.fn()

        mockMediaDevices.enumerateDevices.mockRejectedValue(enumerateError)

        const { result } = renderHook(() => useMediaDevices({ onError }))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.error).toBe(enumerateError)
        })

        expect(onError).toHaveBeenCalledWith(enumerateError)
    })

    it('cleans up the devicechange listener on unmount', () => {
        const { unmount } = renderHook(() => useMediaDevices())

        expect(mockMediaDevices.addEventListener).toHaveBeenCalledTimes(1)
        unmount()
        expect(mockMediaDevices.removeEventListener).toHaveBeenCalledTimes(1)
    })
})
