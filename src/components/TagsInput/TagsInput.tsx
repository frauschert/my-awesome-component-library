import React, {
    forwardRef,
    useState,
    useRef,
    useCallback,
    KeyboardEvent,
} from 'react'
import { classNames } from '../../utility/classnames'
import uniqueId from '../../utility/uniqueId'
import './TagsInput.scss'

export type TagsInputSize = 'sm' | 'md' | 'lg'

export interface TagsInputProps {
    /** Current tags (controlled) */
    value?: string[]
    /** Initial tags (uncontrolled) */
    defaultValue?: string[]
    /** Called when tags change */
    onChange?: (tags: string[]) => void
    /** Placeholder text for the input */
    placeholder?: string
    /** Label text */
    label?: string
    /** Helper text shown below the input */
    helperText?: React.ReactNode
    /** Error text shown below — replaces helperText */
    errorText?: React.ReactNode
    /** Mark as invalid */
    invalid?: boolean
    /** Disable the component */
    disabled?: boolean
    /** Maximum number of tags */
    maxTags?: number
    /** Prevent duplicate tags */
    allowDuplicates?: boolean
    /** Characters that trigger tag creation */
    separators?: string[]
    /** Validate a tag before adding — return false to reject */
    validate?: (tag: string) => boolean
    /** Size variant */
    sizeVariant?: TagsInputSize
    /** Additional CSS class */
    className?: string
    /** Accessible label */
    'aria-label'?: string
    /** ID override */
    id?: string
}

const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(
    (
        {
            value: controlledValue,
            defaultValue = [],
            onChange,
            placeholder = 'Add a tag…',
            label,
            helperText,
            errorText,
            invalid = false,
            disabled = false,
            maxTags,
            allowDuplicates = false,
            separators = ['Enter', ','],
            validate,
            sizeVariant = 'md',
            className,
            'aria-label': ariaLabel,
            id: idProp,
        },
        ref
    ) => {
        const isControlled = controlledValue !== undefined
        const [internalTags, setInternalTags] = useState<string[]>(defaultValue)
        const tags = isControlled ? controlledValue : internalTags
        const [inputValue, setInputValue] = useState('')
        const [focused, setFocused] = useState(false)
        const inputRef = useRef<HTMLInputElement>(null)
        const id = idProp || uniqueId()

        const setTags = useCallback(
            (newTags: string[]) => {
                if (!isControlled) {
                    setInternalTags(newTags)
                }
                onChange?.(newTags)
            },
            [isControlled, onChange]
        )

        const addTag = useCallback(
            (raw: string) => {
                const tag = raw.trim()
                if (!tag) return
                if (!allowDuplicates && tags.includes(tag)) return
                if (maxTags !== undefined && tags.length >= maxTags) return
                if (validate && !validate(tag)) return
                setTags([...tags, tag])
                setInputValue('')
            },
            [tags, setTags, allowDuplicates, maxTags, validate]
        )

        const removeTag = useCallback(
            (index: number) => {
                const newTags = tags.filter((_, i) => i !== index)
                setTags(newTags)
            },
            [tags, setTags]
        )

        const handleKeyDown = useCallback(
            (e: KeyboardEvent<HTMLInputElement>) => {
                if (separators.includes(e.key)) {
                    e.preventDefault()
                    addTag(inputValue)
                } else if (
                    e.key === 'Backspace' &&
                    inputValue === '' &&
                    tags.length > 0
                ) {
                    removeTag(tags.length - 1)
                }
            },
            [separators, addTag, inputValue, tags, removeTag]
        )

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value
                // Check for separator chars typed (e.g. comma)
                const sepChars = separators.filter((s) => s.length === 1)
                if (sepChars.some((sep) => val.endsWith(sep))) {
                    addTag(val.slice(0, -1))
                } else {
                    setInputValue(val)
                }
            },
            [separators, addTag]
        )

        const handlePaste = useCallback(
            (e: React.ClipboardEvent<HTMLInputElement>) => {
                const pasted = e.clipboardData.getData('text')
                const sepChars = separators.filter((s) => s.length === 1)
                if (sepChars.length > 0) {
                    const regex = new RegExp(
                        `[${sepChars.map((c) => '\\' + c).join('')}]`
                    )
                    const parts = pasted.split(regex)
                    if (parts.length > 1) {
                        e.preventDefault()
                        const newTags = [...tags]
                        for (const part of parts) {
                            const tag = part.trim()
                            if (!tag) continue
                            if (!allowDuplicates && newTags.includes(tag))
                                continue
                            if (
                                maxTags !== undefined &&
                                newTags.length >= maxTags
                            )
                                break
                            if (validate && !validate(tag)) continue
                            newTags.push(tag)
                        }
                        if (newTags.length > tags.length) {
                            setTags(newTags)
                            setInputValue('')
                        }
                    }
                }
            },
            [separators, tags, setTags, allowDuplicates, maxTags, validate]
        )

        const handleContainerClick = useCallback(() => {
            if (!disabled) {
                inputRef.current?.focus()
            }
        }, [disabled])

        const showError = invalid || !!errorText
        const helperId = `${id}-helper`

        const mergedRef = useCallback(
            (node: HTMLInputElement | null) => {
                ;(
                    inputRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = node
                if (typeof ref === 'function') {
                    ref(node)
                } else if (ref) {
                    ;(
                        ref as React.MutableRefObject<HTMLInputElement | null>
                    ).current = node
                }
            },
            [ref]
        )

        return (
            <div
                className={classNames(
                    'tags-input',
                    `tags-input--${sizeVariant}`,
                    {
                        'tags-input--focused': focused,
                        'tags-input--invalid': showError,
                        'tags-input--disabled': disabled,
                    },
                    className
                )}
            >
                {label && (
                    <label className="tags-input__label" htmlFor={id}>
                        {label}
                    </label>
                )}
                <div
                    className="tags-input__container"
                    onClick={handleContainerClick}
                >
                    {tags.map((tag, index) => (
                        <span
                            key={`${tag}-${index}`}
                            className="tags-input__tag"
                        >
                            <span className="tags-input__tag-label">{tag}</span>
                            {!disabled && (
                                <button
                                    type="button"
                                    className="tags-input__tag-remove"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeTag(index)
                                    }}
                                    aria-label={`Remove ${tag}`}
                                    tabIndex={-1}
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M9 3L3 9M3 3L9 9"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            )}
                        </span>
                    ))}
                    <input
                        ref={mergedRef}
                        id={id}
                        className="tags-input__input"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={tags.length === 0 ? placeholder : ''}
                        disabled={disabled}
                        aria-label={ariaLabel}
                        aria-invalid={showError || undefined}
                        aria-describedby={
                            errorText || helperText ? helperId : undefined
                        }
                    />
                </div>
                {errorText && (
                    <div
                        id={helperId}
                        className="tags-input__error"
                        role="alert"
                    >
                        {errorText}
                    </div>
                )}
                {!errorText && helperText && (
                    <div id={helperId} className="tags-input__helper">
                        {helperText}
                    </div>
                )}
            </div>
        )
    }
)

TagsInput.displayName = 'TagsInput'

export default TagsInput
