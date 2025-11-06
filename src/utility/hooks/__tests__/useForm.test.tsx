import { renderHook, act, waitFor } from '@testing-library/react'
import useForm from '../useForm'

describe('useForm', () => {
    describe('initialization', () => {
        it('should initialize with default values', () => {
            const { result } = renderHook(() =>
                useForm({
                    defaultValues: { name: 'John', email: 'john@example.com' },
                })
            )

            expect(result.current.values).toEqual({
                name: 'John',
                email: 'john@example.com',
            })
            expect(result.current.errors).toEqual({})
            expect(result.current.isDirty).toBe(false)
            expect(result.current.isValid).toBe(true)
        })

        it('should initialize without default values', () => {
            const { result } = renderHook(() => useForm())

            expect(result.current.values).toEqual({})
            expect(result.current.errors).toEqual({})
        })
    })

    describe('register', () => {
        it('should register a field and handle onChange', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: '' } })
            )

            const field = result.current.register('name')

            expect(field.name).toBe('name')
            expect(field.value).toBe('')

            act(() => {
                field.onChange({ target: { value: 'John' } })
            })

            expect(result.current.values.name).toBe('John')
            expect(result.current.isDirty).toBe(true)
        })

        it('should handle onBlur', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: '' } })
            )

            const field = result.current.register('name')

            act(() => {
                field.onBlur()
            })

            expect(result.current.touchedFields.name).toBe(true)
        })

        it('should handle value without event object', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { count: 0 } })
            )

            const field = result.current.register('count')

            act(() => {
                field.onChange(5)
            })

            expect(result.current.values.count).toBe(5)
        })
    })

    describe('validation - required', () => {
        it('should validate required field', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: '' } })
            )

            result.current.register('email', { required: true })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('email')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.email).toBe('This field is required')
        })

        it('should validate required field with custom message', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: '' } })
            )

            result.current.register('email', {
                required: 'Email is required',
            })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('email')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.email).toBe('Email is required')
        })

        it('should pass validation when field has value', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: 'test@example.com' } })
            )

            result.current.register('email', { required: true })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('email')
            })

            expect(isValid).toBe(true)
            expect(result.current.errors.email).toBeUndefined()
        })
    })

    describe('validation - min/max', () => {
        it('should validate min value', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { age: 15 } })
            )

            result.current.register('age', { min: 18 })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('age')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.age).toBe('Minimum value is 18')
        })

        it('should validate max value', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { score: 150 } })
            )

            result.current.register('score', { max: 100 })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('score')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.score).toBe('Maximum value is 100')
        })

        it('should validate min with custom message', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { age: 15 } })
            )

            result.current.register('age', {
                min: { value: 18, message: 'Must be 18 or older' },
            })

            await act(async () => {
                await result.current.validateField('age')
            })

            expect(result.current.errors.age).toBe('Must be 18 or older')
        })
    })

    describe('validation - length', () => {
        it('should validate minLength', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { password: '123' } })
            )

            result.current.register('password', { minLength: 6 })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('password')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.password).toBe('Minimum length is 6')
        })

        it('should validate maxLength', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { username: 'verylongusername' } })
            )

            result.current.register('username', { maxLength: 10 })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('username')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.username).toBe('Maximum length is 10')
        })

        it('should validate array length', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { items: ['a', 'b'] } })
            )

            result.current.register('items', { minLength: 3 })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('items')
            })

            expect(isValid).toBe(false)
        })
    })

    describe('validation - pattern', () => {
        it('should validate pattern', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: 'invalid-email' } })
            )

            result.current.register('email', {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('email')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.email).toBe('Invalid format')
        })

        it('should validate pattern with custom message', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: 'invalid-email' } })
            )

            result.current.register('email', {
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                },
            })

            await act(async () => {
                await result.current.validateField('email')
            })

            expect(result.current.errors.email).toBe(
                'Please enter a valid email'
            )
        })
    })

    describe('validation - custom', () => {
        it('should validate with custom function', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { password: 'weak' } })
            )

            result.current.register('password', {
                validate: (value) =>
                    value.length >= 8 ||
                    'Password must be at least 8 characters',
            })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('password')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.password).toBe(
                'Password must be at least 8 characters'
            )
        })

        it('should validate with async function', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { username: 'taken' } })
            )

            result.current.register('username', {
                validate: async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 10))
                    return value !== 'taken' || 'Username is already taken'
                },
            })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateField('username')
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.username).toBe(
                'Username is already taken'
            )
        })

        it('should validate with multiple validators', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { password: 'weak123' } })
            )

            result.current.register('password', {
                validate: {
                    hasUpperCase: (value) =>
                        /[A-Z]/.test(value) ||
                        'Must contain at least one uppercase letter',
                    hasSpecialChar: (value) =>
                        /[!@#$%^&*]/.test(value) ||
                        'Must contain at least one special character',
                },
            })

            await act(async () => {
                await result.current.validateField('password')
            })

            expect(result.current.errors.password).toBeTruthy()
        })
    })

    describe('validateForm', () => {
        it('should validate all registered fields', async () => {
            const { result } = renderHook(() =>
                useForm({
                    defaultValues: { email: '', password: '' },
                })
            )

            result.current.register('email', { required: true })
            result.current.register('password', { minLength: 6 })

            let isValid: boolean = false
            await act(async () => {
                isValid = await result.current.validateForm()
            })

            expect(isValid).toBe(false)
            expect(result.current.errors.email).toBeTruthy()
            expect(result.current.errors.password).toBeTruthy()
        })
    })

    describe('setValue', () => {
        it('should set field value', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: '' } })
            )

            act(() => {
                result.current.setValue('name', 'John')
            })

            expect(result.current.values.name).toBe('John')
            expect(result.current.isDirty).toBe(true)
        })

        it('should validate when shouldValidate is true', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: '' } })
            )

            result.current.register('email', { required: true })

            await act(async () => {
                result.current.setValue('email', '', { shouldValidate: true })
                await new Promise((resolve) => setTimeout(resolve, 10))
            })

            await waitFor(() => {
                expect(result.current.errors.email).toBeTruthy()
            })
        })

        it('should not mark as dirty when shouldDirty is false', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: '' } })
            )

            act(() => {
                result.current.setValue('name', 'John', { shouldDirty: false })
            })

            expect(result.current.values.name).toBe('John')
            expect(result.current.isDirty).toBe(false)
        })
    })

    describe('errors', () => {
        it('should set custom error', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { username: '' } })
            )

            act(() => {
                result.current.setError('username', 'Username is taken')
            })

            expect(result.current.errors.username).toBe('Username is taken')
            expect(result.current.isValid).toBe(false)
        })

        it('should clear specific error', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { username: '' } })
            )

            act(() => {
                result.current.setError('username', 'Error')
                result.current.clearError('username')
            })

            expect(result.current.errors.username).toBeUndefined()
        })

        it('should clear all errors', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: '', password: '' } })
            )

            act(() => {
                result.current.setError('email', 'Error 1')
                result.current.setError('password', 'Error 2')
                result.current.clearErrors()
            })

            expect(result.current.errors).toEqual({})
        })
    })

    describe('reset', () => {
        it('should reset to default values', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: 'John' } })
            )

            act(() => {
                result.current.setValue('name', 'Jane')
                result.current.setError('name', 'Error')
                result.current.reset()
            })

            expect(result.current.values.name).toBe('John')
            expect(result.current.errors).toEqual({})
            expect(result.current.isDirty).toBe(false)
        })

        it('should reset to new values', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: 'John' } })
            )

            act(() => {
                result.current.reset({ name: 'Jane' })
            })

            expect(result.current.values.name).toBe('Jane')
        })
    })

    describe('handleSubmit', () => {
        it('should call onValid when form is valid', async () => {
            const onValid = jest.fn()
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: 'test@example.com' } })
            )

            result.current.register('email', { required: true })

            await act(async () => {
                await result.current.handleSubmit(onValid)()
            })

            expect(onValid).toHaveBeenCalledWith({
                email: 'test@example.com',
            })
        })

        it('should call onInvalid when form is invalid', async () => {
            const onValid = jest.fn()
            const onInvalid = jest.fn()
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: '' } })
            )

            result.current.register('email', { required: true })

            await act(async () => {
                await result.current.handleSubmit(onValid, onInvalid)()
            })

            expect(onValid).not.toHaveBeenCalled()
            expect(onInvalid).toHaveBeenCalled()
        })

        it('should set isSubmitting during submission', async () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: 'test@example.com' } })
            )

            result.current.register('email', { required: true })

            const submitHandler = result.current.handleSubmit(async () => {
                // Verify isSubmitting is true during submission
                expect(result.current.isSubmitting).toBe(true)
                await new Promise((resolve) => setTimeout(resolve, 10))
            })

            await act(async () => {
                await submitHandler()
            })

            expect(result.current.isSubmitting).toBe(false)
        })

        it('should prevent default event', async () => {
            const onValid = jest.fn()
            const event = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            } as any

            const { result } = renderHook(() =>
                useForm({ defaultValues: { email: 'test@example.com' } })
            )

            // Register before creating submit handler
            const { handleSubmit } = result.current
            result.current.register('email', { required: true })

            await act(async () => {
                await handleSubmit(onValid)(event)
            })

            expect(event.preventDefault).toHaveBeenCalled()
            expect(event.stopPropagation).toHaveBeenCalled()
        })
    })

    describe('validation modes', () => {
        it('should validate onChange when mode is onChange', async () => {
            const { result } = renderHook(() =>
                useForm({
                    defaultValues: { email: '' },
                    mode: 'onChange',
                })
            )

            // Get field from current result
            let field = result.current.register('email', { required: true })

            await act(async () => {
                field.onChange({ target: { value: '' } })
                // Wait for validation to complete
                await new Promise((resolve) => setTimeout(resolve, 10))
            })

            expect(result.current.errors.email).toBeTruthy()
        })

        it('should validate onBlur when mode is onBlur', async () => {
            const { result } = renderHook(() =>
                useForm({
                    defaultValues: { email: '' },
                    mode: 'onBlur',
                })
            )

            let field = result.current.register('email', { required: true })

            await act(async () => {
                field.onBlur()
                // Wait for deferred validation
                await new Promise((resolve) => setTimeout(resolve, 10))
            })

            expect(result.current.errors.email).toBeTruthy()
        })
    })

    describe('getFieldState', () => {
        it('should return field state', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: '' } })
            )

            let field = result.current.register('name')

            act(() => {
                field.onChange({ target: { value: 'John' } })
                field.onBlur()
            })

            act(() => {
                result.current.setError('name', 'Error')
            })

            const fieldState = result.current.getFieldState('name')

            expect(fieldState.error).toBe('Error')
            expect(fieldState.isDirty).toBe(true)
            expect(fieldState.isTouched).toBe(true)
        })
    })

    describe('setValues', () => {
        it('should set multiple values', () => {
            const { result } = renderHook(() =>
                useForm({ defaultValues: { name: '', email: '' } })
            )

            const { setValues } = result.current

            act(() => {
                setValues({
                    name: 'John',
                    email: 'john@example.com',
                })
            })

            expect(result.current.values).toEqual({
                name: 'John',
                email: 'john@example.com',
            })
        })
    })
})
