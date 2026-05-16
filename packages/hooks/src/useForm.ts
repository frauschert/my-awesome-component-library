import { useState, useCallback, useRef, FormEvent } from 'react'

export interface ValidationRule<T = unknown> {
    required?: boolean | string
    min?: number | { value: number; message: string }
    max?: number | { value: number; message: string }
    minLength?: number | { value: number; message: string }
    maxLength?: number | { value: number; message: string }
    pattern?: RegExp | { value: RegExp; message: string }
    validate?:
        | ((value: T) => boolean | string | Promise<boolean | string>)
        | Record<
              string,
              (value: T) => boolean | string | Promise<boolean | string>
          >
}

export interface FieldConfig<T = unknown> {
    defaultValue?: T
    rules?: ValidationRule<T>
}

export interface UseFormOptions<T extends Record<string, unknown>> {
    defaultValues?: Partial<T>
    mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'all'
    reValidateMode?: 'onSubmit' | 'onBlur' | 'onChange'
}

export interface FieldState {
    error?: string
    isDirty: boolean
    isTouched: boolean
}

export interface UseFormReturn<T extends Record<string, unknown>> {
    values: T
    errors: Partial<Record<keyof T, string>>
    isDirty: boolean
    isValid: boolean
    isSubmitting: boolean
    touchedFields: Partial<Record<keyof T, boolean>>
    dirtyFields: Partial<Record<keyof T, boolean>>
    register: (
        name: keyof T,
        rules?: ValidationRule
    ) => {
        name: keyof T
        value: T[keyof T] | ''
        onChange: (e: React.ChangeEvent<HTMLInputElement> | T[keyof T]) => void
        onBlur: () => void
    }
    setValue: (
        name: keyof T,
        value: T[keyof T],
        options?: {
            shouldValidate?: boolean
            shouldDirty?: boolean
            shouldTouch?: boolean
        }
    ) => void
    getValue: (name: keyof T) => T[keyof T]
    setError: (name: keyof T, error: string) => void
    clearError: (name: keyof T) => void
    clearErrors: () => void
    reset: (values?: Partial<T>) => void
    handleSubmit: (
        onValid: (data: T) => void | Promise<void>,
        onInvalid?: (errors: Partial<Record<keyof T, string>>) => void
    ) => (e?: FormEvent) => Promise<void>
    validateField: (name: keyof T) => Promise<boolean>
    validateForm: () => Promise<boolean>
    setValues: (values: Partial<T>) => void
    getFieldState: (name: keyof T) => FieldState
}

/**
 * Hook for managing form state, validation, and submission.
 * Provides comprehensive form handling with field-level validation and control.
 *
 * @param options - Configuration options
 * @returns Form state and control functions
 *
 * @example
 * ```tsx
 * const { register, handleSubmit, errors, isValid } = useForm({
 *   defaultValues: { email: '', password: '' }
 * })
 *
 * const onSubmit = (data) => console.log(data)
 *
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <input {...register('email', {
 *     required: 'Email is required',
 *     pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
 *   })} />
 *   {errors.email && <span>{errors.email}</span>}
 * </form>
 * ```
 */
export default function useForm<T extends Record<string, unknown>>(
    options: UseFormOptions<T> = {}
): UseFormReturn<T> {
    const {
        defaultValues = {} as Partial<T>,
        mode = 'onSubmit',
        reValidateMode = 'onChange',
    } = options

    const [values, setValuesState] = useState<T>(defaultValues as T)
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
    const [touchedFields, setTouchedFields] = useState<
        Partial<Record<keyof T, boolean>>
    >({})
    const [dirtyFields, setDirtyFields] = useState<
        Partial<Record<keyof T, boolean>>
    >({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const validationRules = useRef<Partial<Record<keyof T, ValidationRule>>>({})
    const defaultValuesRef = useRef<Partial<T>>(defaultValues)

    // Validate a single field
    const validateField = useCallback(
        async (name: keyof T): Promise<boolean> => {
            const value = values[name]
            const rules = validationRules.current[name]

            if (!rules) return true

            // Required validation
            if (rules.required) {
                const isEmpty =
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0)

                if (isEmpty) {
                    const message =
                        typeof rules.required === 'string'
                            ? rules.required
                            : 'This field is required'
                    setErrors((prev) => ({ ...prev, [name]: message }))
                    return false
                }
            }

            // Min validation
            if (rules.min !== undefined) {
                const minValue =
                    typeof rules.min === 'object' ? rules.min.value : rules.min
                const minMessage =
                    typeof rules.min === 'object'
                        ? rules.min.message
                        : `Minimum value is ${minValue}`

                if (typeof value === 'number' && value < minValue) {
                    setErrors((prev) => ({ ...prev, [name]: minMessage }))
                    return false
                }
            }

            // Max validation
            if (rules.max !== undefined) {
                const maxValue =
                    typeof rules.max === 'object' ? rules.max.value : rules.max
                const maxMessage =
                    typeof rules.max === 'object'
                        ? rules.max.message
                        : `Maximum value is ${maxValue}`

                if (typeof value === 'number' && value > maxValue) {
                    setErrors((prev) => ({ ...prev, [name]: maxMessage }))
                    return false
                }
            }

            // MinLength validation
            if (rules.minLength !== undefined) {
                const minLength =
                    typeof rules.minLength === 'object'
                        ? rules.minLength.value
                        : rules.minLength
                const minLengthMessage =
                    typeof rules.minLength === 'object'
                        ? rules.minLength.message
                        : `Minimum length is ${minLength}`

                if (
                    (typeof value === 'string' || Array.isArray(value)) &&
                    (value as string | unknown[]).length < minLength
                ) {
                    setErrors((prev) => ({ ...prev, [name]: minLengthMessage }))
                    return false
                }
            }

            // MaxLength validation
            if (rules.maxLength !== undefined) {
                const maxLength =
                    typeof rules.maxLength === 'object'
                        ? rules.maxLength.value
                        : rules.maxLength
                const maxLengthMessage =
                    typeof rules.maxLength === 'object'
                        ? rules.maxLength.message
                        : `Maximum length is ${maxLength}`

                if (
                    (typeof value === 'string' || Array.isArray(value)) &&
                    (value as string | unknown[]).length > maxLength
                ) {
                    setErrors((prev) => ({ ...prev, [name]: maxLengthMessage }))
                    return false
                }
            }

            // Pattern validation
            if (
                rules.pattern &&
                value !== undefined &&
                value !== null &&
                value !== ''
            ) {
                const pattern =
                    'value' in rules.pattern
                        ? rules.pattern.value
                        : rules.pattern
                const patternMessage =
                    'value' in rules.pattern
                        ? rules.pattern.message
                        : 'Invalid format'

                if (typeof value === 'string' && !pattern.test(value)) {
                    setErrors((prev) => ({ ...prev, [name]: patternMessage }))
                    return false
                }
            }

            // Custom validation
            if (rules.validate) {
                if (typeof rules.validate === 'function') {
                    const result = await rules.validate(value)
                    if (result === false || typeof result === 'string') {
                        const message =
                            typeof result === 'string'
                                ? result
                                : 'Validation failed'
                        setErrors((prev) => ({ ...prev, [name]: message }))
                        return false
                    }
                } else {
                    // Multiple validators
                    for (const [key, validator] of Object.entries(
                        rules.validate
                    )) {
                        const result = await validator(value)
                        if (result === false || typeof result === 'string') {
                            const message =
                                typeof result === 'string'
                                    ? result
                                    : `${key} validation failed`
                            setErrors((prev) => ({ ...prev, [name]: message }))
                            return false
                        }
                    }
                }
            }

            // Clear error if validation passed
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })

            return true
        },
        [values]
    )

    // Validate entire form
    const validateForm = useCallback(async (): Promise<boolean> => {
        const fieldNames = Object.keys(validationRules.current) as (keyof T)[]
        const results = await Promise.all(
            fieldNames.map((name) => validateField(name))
        )
        return results.every((result) => result === true)
    }, [validateField])

    // Register a field
    const register = useCallback(
        (name: keyof T, rules?: ValidationRule) => {
            if (rules) {
                validationRules.current[name] = rules
            }

            const onChange = (
                e: React.ChangeEvent<HTMLInputElement> | T[keyof T]
            ) => {
                const value =
                    typeof e === 'object' && e !== null && 'target' in e
                        ? e.target.value
                        : e

                setValuesState((prev) => ({ ...prev, [name]: value }))

                // Mark as dirty
                setDirtyFields((prev) => ({ ...prev, [name]: true }))

                // Validate based on mode
                const shouldValidate =
                    mode === 'onChange' ||
                    mode === 'all' ||
                    (isSubmitted &&
                        (reValidateMode === 'onChange' ||
                            reValidateMode === 'onBlur'))

                if (shouldValidate) {
                    // Defer validation to next tick to use updated value
                    setTimeout(() => validateField(name), 0)
                }
            }

            const onBlur = () => {
                setTouchedFields((prev) => ({ ...prev, [name]: true }))

                const shouldValidate =
                    mode === 'onBlur' ||
                    mode === 'all' ||
                    (isSubmitted && reValidateMode === 'onBlur')

                if (shouldValidate) {
                    // Defer to next tick
                    setTimeout(() => validateField(name), 0)
                }
            }

            return {
                name,
                value: (values[name] ?? '') as T[keyof T] | '',
                onChange,
                onBlur,
            }
        },
        [values, mode, reValidateMode, isSubmitted, validateField]
    )

    // Set a single field value
    const setValue = useCallback(
        (
            name: keyof T,
            value: T[keyof T],
            options: {
                shouldValidate?: boolean
                shouldDirty?: boolean
                shouldTouch?: boolean
            } = {}
        ) => {
            const {
                shouldValidate = false,
                shouldDirty = true,
                shouldTouch = false,
            } = options

            setValuesState((prev) => ({ ...prev, [name]: value }))

            if (shouldDirty) {
                setDirtyFields((prev) => ({ ...prev, [name]: true }))
            }

            if (shouldTouch) {
                setTouchedFields((prev) => ({ ...prev, [name]: true }))
            }

            if (shouldValidate) {
                setTimeout(() => validateField(name), 0)
            }
        },
        [validateField]
    )

    // Get a single field value
    const getValue = useCallback((name: keyof T) => values[name], [values])

    // Set error for a field
    const setError = useCallback((name: keyof T, error: string) => {
        setErrors((prev) => ({ ...prev, [name]: error }))
    }, [])

    // Clear error for a field
    const clearError = useCallback((name: keyof T) => {
        setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[name]
            return newErrors
        })
    }, [])

    // Clear all errors
    const clearErrors = useCallback(() => {
        setErrors({})
    }, [])

    // Reset form
    const reset = useCallback((newValues?: Partial<T>) => {
        const resetValues = (newValues ?? defaultValuesRef.current) as T
        setValuesState(resetValues)
        setErrors({})
        setTouchedFields({})
        setDirtyFields({})
        setIsSubmitted(false)
        setIsSubmitting(false)
    }, [])

    // Handle form submission
    const handleSubmit = useCallback(
        (
                onValid: (data: T) => void | Promise<void>,
                onInvalid?: (errors: Partial<Record<keyof T, string>>) => void
            ) =>
            async (e?: FormEvent) => {
                if (e) {
                    e.preventDefault()
                    e.stopPropagation()
                }

                setIsSubmitting(true)
                setIsSubmitted(true)

                const isValid = await validateForm()

                if (isValid) {
                    try {
                        await onValid(values)
                    } catch (error) {
                        console.error('Form submission error:', error)
                    }
                } else {
                    onInvalid?.(errors)
                }

                setIsSubmitting(false)
            },
        [values, errors, validateForm]
    )

    // Set multiple values
    const setValues = useCallback((newValues: Partial<T>) => {
        setValuesState((prev) => ({ ...prev, ...newValues }))
    }, [])

    // Get field state
    const getFieldState = useCallback(
        (name: keyof T): FieldState => ({
            error: errors[name],
            isDirty: dirtyFields[name] ?? false,
            isTouched: touchedFields[name] ?? false,
        }),
        [errors, dirtyFields, touchedFields]
    )

    // Computed properties
    const isDirty = Object.keys(dirtyFields).length > 0
    const isValid = Object.keys(errors).length === 0

    return {
        values,
        errors,
        isDirty,
        isValid,
        isSubmitting,
        touchedFields,
        dirtyFields,
        register,
        setValue,
        getValue,
        setError,
        clearError,
        clearErrors,
        reset,
        handleSubmit,
        validateField,
        validateForm,
        setValues,
        getFieldState,
    }
}
