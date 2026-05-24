import { act, renderHook } from '@testing-library/react'
import useStorageEvent from '../useStorageEvent'

function emitStorageEvent(eventInit: {
    key: string | null
    oldValue: string | null
    newValue: string | null
    storageArea?: Storage | null
    url?: string
}) {
    const event = new Event('storage') as StorageEvent

    Object.assign(event, {
        key: eventInit.key,
        oldValue: eventInit.oldValue,
        newValue: eventInit.newValue,
        storageArea: eventInit.storageArea ?? null,
        url: eventInit.url ?? 'https://example.com',
    })

    window.dispatchEvent(event)
}

describe('useStorageEvent', () => {
    it('captures matching storage events', () => {
        const onChange = jest.fn()
        const { result } = renderHook(() =>
            useStorageEvent({
                key: 'theme',
                storageArea: window.localStorage,
                onChange,
            })
        )

        act(() => {
            emitStorageEvent({
                key: 'theme',
                oldValue: 'light',
                newValue: 'dark',
                storageArea: window.localStorage,
                url: 'https://example.com/settings',
            })
        })

        expect(result.current.isSupported).toBe(true)
        expect(result.current.event).toEqual({
            key: 'theme',
            oldValue: 'light',
            newValue: 'dark',
            oldRawValue: 'light',
            newRawValue: 'dark',
            storageArea: window.localStorage,
            url: 'https://example.com/settings',
        })
        expect(result.current.key).toBe('theme')
        expect(result.current.oldValue).toBe('light')
        expect(result.current.newValue).toBe('dark')
        expect(result.current.url).toBe('https://example.com/settings')
        expect(onChange).toHaveBeenCalledWith({
            key: 'theme',
            oldValue: 'light',
            newValue: 'dark',
            oldRawValue: 'light',
            newRawValue: 'dark',
            storageArea: window.localStorage,
            url: 'https://example.com/settings',
        })
    })

    it('ignores non-matching keys and storage areas', () => {
        const { result } = renderHook(() =>
            useStorageEvent({
                key: 'theme',
                storageArea: window.localStorage,
            })
        )

        act(() => {
            emitStorageEvent({
                key: 'locale',
                oldValue: 'en',
                newValue: 'de',
                storageArea: window.localStorage,
            })
        })

        expect(result.current.event).toBe(null)

        act(() => {
            emitStorageEvent({
                key: 'theme',
                oldValue: 'light',
                newValue: 'dark',
                storageArea: window.sessionStorage,
            })
        })

        expect(result.current.event).toBe(null)
    })

    it('supports custom deserialization', () => {
        const { result } = renderHook(() =>
            useStorageEvent<{ mode: string }>({
                key: 'preferences',
                deserialize: JSON.parse,
            })
        )

        act(() => {
            emitStorageEvent({
                key: 'preferences',
                oldValue: '{"mode":"light"}',
                newValue: '{"mode":"dark"}',
                storageArea: window.localStorage,
            })
        })

        expect(result.current.oldValue).toEqual({ mode: 'light' })
        expect(result.current.newValue).toEqual({ mode: 'dark' })
    })

    it('surfaces deserialization errors and leaves the last good event intact', () => {
        const onError = jest.fn()
        const { result } = renderHook(() =>
            useStorageEvent<{ mode: string }>({
                key: 'preferences',
                deserialize: JSON.parse,
                onError,
            })
        )

        act(() => {
            emitStorageEvent({
                key: 'preferences',
                oldValue: '{"mode":"light"}',
                newValue: '{"mode":"dark"}',
                storageArea: window.localStorage,
            })
        })

        act(() => {
            emitStorageEvent({
                key: 'preferences',
                oldValue: '{"mode":"dark"}',
                newValue: '{invalid json}',
                storageArea: window.localStorage,
            })
        })

        expect(result.current.event).toEqual({
            key: 'preferences',
            oldValue: { mode: 'light' },
            newValue: { mode: 'dark' },
            oldRawValue: '{"mode":"light"}',
            newRawValue: '{"mode":"dark"}',
            storageArea: window.localStorage,
            url: 'https://example.com',
        })
        expect(result.current.error).toBeInstanceOf(Error)
        expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })

    it('resets the stored event state', () => {
        const { result } = renderHook(() => useStorageEvent())

        act(() => {
            emitStorageEvent({
                key: 'theme',
                oldValue: 'light',
                newValue: 'dark',
                storageArea: window.localStorage,
            })
        })

        expect(result.current.event).not.toBe(null)

        act(() => {
            result.current.reset()
        })

        expect(result.current.event).toBe(null)
        expect(result.current.error).toBe(null)
        expect(result.current.key).toBe(null)
        expect(result.current.newValue).toBe(null)
    })
})
