import { classNames } from '../classnames'

describe('classNames', () => {
    it('should join all provided classnames', () => {
        expect(classNames('test', '1', 'test2')).toBe('test 1 test2')
    })

    it('should handle object with boolean values', () => {
        expect(classNames('test', { 1: true }, 'test2')).toBe('test 1 test2')
    })

    it('should handle null values', () => {
        expect(classNames('test', null, 'test2')).toBe('test test2')
    })

    it('should handle undefined values', () => {
        expect(classNames('test', undefined, 'test2')).toBe('test test2')
    })

    it('should filter out empty strings', () => {
        expect(classNames('test', '', 'test2')).toBe('test test2')
    })

    it('should handle false boolean values', () => {
        expect(classNames('test', false, 'test2')).toBe('test test2')
    })

    it('should handle conditional objects', () => {
        expect(
            classNames('btn', {
                'btn-primary': true,
                'btn-disabled': false,
                'btn-large': true,
            })
        ).toBe('btn btn-primary btn-large')
    })

    it('should handle arrays', () => {
        expect(classNames('foo', ['bar', 'baz'])).toBe('foo bar baz')
    })

    it('should handle nested arrays', () => {
        expect(classNames('foo', ['bar', ['baz', 'qux']])).toBe(
            'foo bar baz qux'
        )
    })

    it('should handle arrays with null and undefined', () => {
        expect(classNames(['foo', null, undefined, 'bar'])).toBe('foo bar')
    })

    it('should handle mixed arguments', () => {
        expect(
            classNames(
                'btn',
                { 'btn-primary': true, 'btn-disabled': false },
                ['large', 'rounded'],
                null,
                'active'
            )
        ).toBe('btn btn-primary large rounded active')
    })

    it('should handle object with null/undefined values', () => {
        expect(
            classNames('test', {
                active: true,
                disabled: null,
                hidden: undefined,
            })
        ).toBe('test active')
    })

    it('should return empty string when no valid classes', () => {
        expect(classNames()).toBe('')
        expect(classNames(null, undefined, false)).toBe('')
        expect(classNames({ active: false, disabled: false })).toBe('')
    })

    it('should handle only own properties', () => {
        const proto = { inherited: true }
        const obj = Object.create(proto)
        obj.own = true
        expect(classNames(obj)).toBe('own')
    })

    it('should handle numeric class names in objects', () => {
        expect(classNames({ 0: true, 1: false, 2: true })).toBe('0 2')
    })

    it('should handle class names with special characters', () => {
        expect(classNames('test-class', 'test_class', 'test:class')).toBe(
            'test-class test_class test:class'
        )
    })

    it('should handle repeated class names', () => {
        expect(classNames('foo', 'bar', 'foo')).toBe('foo bar foo')
    })

    it('should handle very long class names', () => {
        const longClass = 'a'.repeat(100)
        expect(classNames('foo', longClass, 'bar')).toBe(`foo ${longClass} bar`)
    })

    it('should handle empty arrays', () => {
        expect(classNames('foo', [], 'bar')).toBe('foo bar')
    })

    it('should handle complex nested structures', () => {
        expect(
            classNames(
                'base',
                { active: true },
                ['foo', { bar: true, baz: false }],
                null,
                undefined,
                'end'
            )
        ).toBe('base active foo bar end')
    })
})
