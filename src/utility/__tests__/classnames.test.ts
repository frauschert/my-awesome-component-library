import { classNames } from '../classnames'

test('should join all provided classnames', () => {
    expect(classNames('test', '1', 'test2')).toBe('test 1 test2')
})

test('should join all provided classnames #2', () => {
    expect(classNames('test', { 1: true }, 'test2')).toBe('test 1 test2')
})

test('should join all provided classnames #3', () => {
    expect(classNames('test', null, 'test2')).toBe('test test2')
})
