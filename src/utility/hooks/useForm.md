# useForm

A comprehensive hook for managing form state, validation, and submission with field-level controls.

## Features

-   ✅ Form state management with field tracking
-   ✅ Comprehensive validation rules (required, min/max, length, pattern, custom)
-   ✅ Multiple validation modes (onSubmit, onBlur, onChange, all)
-   ✅ Async validation support
-   ✅ Field-level dirty and touched tracking
-   ✅ Form submission with loading states
-   ✅ Programmatic field control (setValue, setError, reset)
-   ✅ Type-safe with TypeScript

## Basic Usage

```tsx
import { useForm } from '@your-org/component-library'

function LoginForm() {
    const { register, handleSubmit, errors, isValid } = useForm({
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = (data) => {
        console.log('Form data:', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                    },
                })}
            />
            {errors.email && <span>{errors.email}</span>}

            <input
                type="password"
                {...register('password', {
                    required: 'Password is required',
                    minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                    },
                })}
            />
            {errors.password && <span>{errors.password}</span>}

            <button type="submit" disabled={!isValid}>
                Login
            </button>
        </form>
    )
}
```

## Validation Modes

Control when validation occurs:

```tsx
// Validate only on form submission (default)
const form = useForm({ mode: 'onSubmit' })

// Validate on blur
const form = useForm({ mode: 'onBlur' })

// Validate on every change
const form = useForm({ mode: 'onChange' })

// Validate on both blur and change
const form = useForm({ mode: 'all' })
```

## Validation Rules

### Required Field

```tsx
register('username', {
    required: true, // Default message
    // or
    required: 'Username is required', // Custom message
})
```

### Min/Max Values

```tsx
register('age', {
    min: 18, // Simple minimum
    max: { value: 100, message: 'Must be under 100' }, // With custom message
})
```

### Length Validation

```tsx
register('password', {
    minLength: 8,
    maxLength: { value: 32, message: 'Too long!' },
})
```

### Pattern Matching

```tsx
register('email', {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple regex
    // or
    pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email',
    },
})
```

### Custom Validation

```tsx
// Single validator
register('password', {
    validate: (value) =>
        value.length >= 8 || 'Password must be at least 8 characters',
})

// Multiple validators
register('password', {
    validate: {
        hasUpperCase: (value) =>
            /[A-Z]/.test(value) || 'Must contain uppercase letter',
        hasLowerCase: (value) =>
            /[a-z]/.test(value) || 'Must contain lowercase letter',
        hasNumber: (value) => /[0-9]/.test(value) || 'Must contain number',
    },
})

// Async validation
register('username', {
    validate: async (value) => {
        const exists = await checkUsernameExists(value)
        return !exists || 'Username already taken'
    },
})
```

## Programmatic Control

### Setting Field Values

```tsx
const { setValue } = useForm()

// Basic set
setValue('email', 'user@example.com')

// With options
setValue('email', 'user@example.com', {
    shouldValidate: true, // Trigger validation
    shouldDirty: true, // Mark as dirty
    shouldTouch: true, // Mark as touched
})
```

### Getting Field Values

```tsx
const { getValue, values } = useForm()

const email = getValue('email')
// or access all values
console.log(values)
```

### Managing Errors

```tsx
const { setError, clearError, clearErrors } = useForm()

// Set custom error
setError('username', 'Username already taken')

// Clear specific error
clearError('username')

// Clear all errors
clearErrors()
```

### Resetting Form

```tsx
const { reset } = useForm({ defaultValues: { name: 'John' } })

// Reset to default values
reset()

// Reset to new values
reset({ name: 'Jane', email: 'jane@example.com' })
```

## Field State Tracking

Track individual field states:

```tsx
const { getFieldState, dirtyFields, touchedFields } = useForm()

const fieldState = getFieldState('email')
console.log(fieldState.error) // Field error message
console.log(fieldState.isDirty) // Has value changed?
console.log(fieldState.isTouched) // Has field been blurred?

// Check all dirty fields
console.log(dirtyFields) // { email: true, password: false }
```

## Form State

Access global form state:

```tsx
const {
    isDirty, // Has any field changed?
    isValid, // Are all validations passing?
    isSubmitting, // Is form currently submitting?
    errors, // All field errors
    values, // All field values
} = useForm()

return (
    <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
)
```

## Advanced: Manual Validation

Validate fields programmatically:

```tsx
const { validateField, validateForm } = useForm()

// Validate single field
const isEmailValid = await validateField('email')

// Validate entire form
const isFormValid = await validateForm()
```

## Advanced: Form Submission

Handle both valid and invalid submissions:

```tsx
const { handleSubmit } = useForm()

const onValid = (data) => {
    console.log('Valid data:', data)
}

const onInvalid = (errors) => {
    console.error('Validation errors:', errors)
}

return <form onSubmit={handleSubmit(onValid, onInvalid)}>...</form>
```

## Advanced: Dynamic Forms

```tsx
function DynamicForm() {
    const { register, setValue, values } = useForm({
        defaultValues: { items: [] },
    })

    const addItem = () => {
        setValue('items', [...values.items, ''])
    }

    return (
        <form>
            {values.items.map((_, index) => (
                <input key={index} {...register(`items.${index}`)} />
            ))}
            <button type="button" onClick={addItem}>
                Add Item
            </button>
        </form>
    )
}
```

## Type Safety

Full TypeScript support with type inference:

```tsx
interface FormData {
    username: string
    email: string
    age: number
}

const form = useForm<FormData>({
    defaultValues: {
        username: '',
        email: '',
        age: 0,
    },
})

// Type-safe field registration
form.register('username', { required: true })
// form.register('invalid') // ❌ TypeScript error

// Type-safe values
const username: string = form.values.username
```

## API Reference

### useForm(options?)

#### Options

| Option           | Type                                            | Default      | Description                      |
| ---------------- | ----------------------------------------------- | ------------ | -------------------------------- |
| `defaultValues`  | `Partial<T>`                                    | `{}`         | Initial form values              |
| `mode`           | `'onSubmit' \| 'onBlur' \| 'onChange' \| 'all'` | `'onSubmit'` | When to trigger validation       |
| `reValidateMode` | `'onSubmit' \| 'onBlur' \| 'onChange'`          | `'onChange'` | When to re-validate after submit |

#### Return Value

| Property        | Type                                             | Description                    |
| --------------- | ------------------------------------------------ | ------------------------------ |
| `values`        | `T`                                              | Current form values            |
| `errors`        | `Partial<Record<keyof T, string>>`               | Validation errors              |
| `isDirty`       | `boolean`                                        | Has any field changed?         |
| `isValid`       | `boolean`                                        | Are all validations passing?   |
| `isSubmitting`  | `boolean`                                        | Is form submitting?            |
| `touchedFields` | `Partial<Record<keyof T, boolean>>`              | Fields that have been blurred  |
| `dirtyFields`   | `Partial<Record<keyof T, boolean>>`              | Fields that have been modified |
| `register`      | `(name, rules?) => RegisterReturn`               | Register a field               |
| `setValue`      | `(name, value, options?) => void`                | Set field value                |
| `getValue`      | `(name) => value`                                | Get field value                |
| `setError`      | `(name, error) => void`                          | Set field error                |
| `clearError`    | `(name) => void`                                 | Clear field error              |
| `clearErrors`   | `() => void`                                     | Clear all errors               |
| `reset`         | `(values?) => void`                              | Reset form                     |
| `handleSubmit`  | `(onValid, onInvalid?) => (e?) => Promise<void>` | Create submit handler          |
| `validateField` | `(name) => Promise<boolean>`                     | Validate single field          |
| `validateForm`  | `() => Promise<boolean>`                         | Validate entire form           |
| `setValues`     | `(values) => void`                               | Set multiple values            |
| `getFieldState` | `(name) => FieldState`                           | Get field state                |

### ValidationRule

| Rule        | Type                                           | Description          |
| ----------- | ---------------------------------------------- | -------------------- |
| `required`  | `boolean \| string`                            | Field is required    |
| `min`       | `number \| { value: number, message: string }` | Minimum value        |
| `max`       | `number \| { value: number, message: string }` | Maximum value        |
| `minLength` | `number \| { value: number, message: string }` | Minimum length       |
| `maxLength` | `number \| { value: number, message: string }` | Maximum length       |
| `pattern`   | `RegExp \| { value: RegExp, message: string }` | Pattern to match     |
| `validate`  | `Function \| Record<string, Function>`         | Custom validation(s) |

## Notes

-   Validation runs asynchronously to support async validators
-   The `register` function returns props that can be spread onto inputs
-   Field names must be keys of the form data type
-   Validation errors are cleared automatically when a field passes validation
-   The form maintains submission state during async submissions
