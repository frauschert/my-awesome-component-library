/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react-hooks'
import { useLocalStorage } from './useStorage'

const TEST_KEY = 'key'
const TEST_VALUE = { test: 'test' }

test('should set localStorage with default value', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE))
    expect(result.current[0]).toEqual(TEST_VALUE)
})
