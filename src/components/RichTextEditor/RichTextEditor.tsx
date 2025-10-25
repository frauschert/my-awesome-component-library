import React, { useRef, useCallback, useEffect, useState } from 'react'
import './RichTextEditor.scss'

export type RichTextEditorProps = {
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
    minHeight?: string | number
    maxHeight?: string | number
    showToolbar?: boolean
    toolbarItems?: ToolbarItem[]
    className?: string
    id?: string
    ariaLabel?: string
}

export type ToolbarItem =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'paragraph'
    | 'orderedList'
    | 'unorderedList'
    | 'blockquote'
    | 'link'
    | 'image'
    | 'code'
    | 'codeBlock'
    | 'horizontalRule'
    | 'undo'
    | 'redo'
    | 'clear'

const defaultToolbarItems: ToolbarItem[] = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'h1',
    'h2',
    'h3',
    'paragraph',
    'orderedList',
    'unorderedList',
    'blockquote',
    'link',
    'code',
    'horizontalRule',
    'undo',
    'redo',
    'clear',
]

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    defaultValue = '',
    onChange,
    placeholder = 'Start typing...',
    disabled = false,
    readOnly = false,
    autoFocus = false,
    minHeight = '200px',
    maxHeight,
    showToolbar = true,
    toolbarItems = defaultToolbarItems,
    className = '',
    id,
    ariaLabel = 'Rich text editor',
}) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const isControlled = value !== undefined

    useEffect(() => {
        if (editorRef.current && !isControlled) {
            editorRef.current.innerHTML = defaultValue
        }
    }, [defaultValue, isControlled])

    useEffect(() => {
        if (editorRef.current && isControlled && value !== undefined) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value
            }
        }
    }, [value, isControlled])

    useEffect(() => {
        if (autoFocus && editorRef.current) {
            editorRef.current.focus()
        }
    }, [autoFocus])

    const handleInput = useCallback(() => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML)
        }
    }, [onChange])

    const handleFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleBlur = useCallback(() => {
        setIsFocused(false)
    }, [])

    const execCommand = useCallback(
        (command: string, value?: string) => {
            if (disabled || readOnly) return

            document.execCommand(command, false, value)
            editorRef.current?.focus()
            handleInput()
        },
        [disabled, readOnly, handleInput]
    )

    const handleToolbarAction = useCallback(
        (item: ToolbarItem) => {
            switch (item) {
                case 'bold':
                    execCommand('bold')
                    break
                case 'italic':
                    execCommand('italic')
                    break
                case 'underline':
                    execCommand('underline')
                    break
                case 'strikethrough':
                    execCommand('strikeThrough')
                    break
                case 'h1':
                    execCommand('formatBlock', '<h1>')
                    break
                case 'h2':
                    execCommand('formatBlock', '<h2>')
                    break
                case 'h3':
                    execCommand('formatBlock', '<h3>')
                    break
                case 'paragraph':
                    execCommand('formatBlock', '<p>')
                    break
                case 'orderedList':
                    execCommand('insertOrderedList')
                    break
                case 'unorderedList':
                    execCommand('insertUnorderedList')
                    break
                case 'blockquote':
                    execCommand('formatBlock', '<blockquote>')
                    break
                case 'link': {
                    const url = window.prompt('Enter URL:')
                    if (url) {
                        execCommand('createLink', url)
                    }
                    break
                }
                case 'image': {
                    const imageUrl = window.prompt('Enter image URL:')
                    if (imageUrl) {
                        execCommand('insertImage', imageUrl)
                    }
                    break
                }
                case 'code':
                    execCommand('formatBlock', '<pre>')
                    break
                case 'codeBlock':
                    execCommand('formatBlock', '<pre>')
                    break
                case 'horizontalRule':
                    execCommand('insertHorizontalRule')
                    break
                case 'undo':
                    execCommand('undo')
                    break
                case 'redo':
                    execCommand('redo')
                    break
                case 'clear':
                    if (editorRef.current) {
                        editorRef.current.innerHTML = ''
                        handleInput()
                    }
                    break
            }
        },
        [execCommand, handleInput]
    )

    const getToolbarIcon = (item: ToolbarItem): string => {
        const icons: Record<ToolbarItem, string> = {
            bold: '𝐁',
            italic: '𝐼',
            underline: 'U̲',
            strikethrough: 'S̶',
            h1: 'H1',
            h2: 'H2',
            h3: 'H3',
            paragraph: '¶',
            orderedList: '1.',
            unorderedList: '•',
            blockquote: '❝',
            link: '🔗',
            image: '🖼',
            code: '</>',
            codeBlock: '{}',
            horizontalRule: '─',
            undo: '↶',
            redo: '↷',
            clear: '✕',
        }
        return icons[item]
    }

    const getToolbarLabel = (item: ToolbarItem): string => {
        const labels: Record<ToolbarItem, string> = {
            bold: 'Bold',
            italic: 'Italic',
            underline: 'Underline',
            strikethrough: 'Strikethrough',
            h1: 'Heading 1',
            h2: 'Heading 2',
            h3: 'Heading 3',
            paragraph: 'Paragraph',
            orderedList: 'Ordered List',
            unorderedList: 'Unordered List',
            blockquote: 'Quote',
            link: 'Insert Link',
            image: 'Insert Image',
            code: 'Code',
            codeBlock: 'Code Block',
            horizontalRule: 'Horizontal Rule',
            undo: 'Undo',
            redo: 'Redo',
            clear: 'Clear Formatting',
        }
        return labels[item]
    }

    const editorClasses = [
        'rich-text-editor',
        className,
        isFocused && 'rich-text-editor--focused',
        disabled && 'rich-text-editor--disabled',
        readOnly && 'rich-text-editor--readonly',
    ]
        .filter(Boolean)
        .join(' ')

    const editorStyle: React.CSSProperties = {
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        maxHeight: maxHeight
            ? typeof maxHeight === 'number'
                ? `${maxHeight}px`
                : maxHeight
            : undefined,
    }

    return (
        <div className={editorClasses}>
            {showToolbar && !readOnly && (
                <div
                    className="rich-text-editor__toolbar"
                    role="toolbar"
                    aria-label="Text formatting"
                >
                    {toolbarItems.map((item, index) => (
                        <button
                            key={`${item}-${index}`}
                            type="button"
                            className="rich-text-editor__toolbar-button"
                            onClick={() => handleToolbarAction(item)}
                            disabled={disabled}
                            title={getToolbarLabel(item)}
                            aria-label={getToolbarLabel(item)}
                        >
                            {getToolbarIcon(item)}
                        </button>
                    ))}
                </div>
            )}
            <div
                ref={editorRef}
                className="rich-text-editor__content"
                contentEditable={!disabled && !readOnly}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={editorStyle}
                role="textbox"
                aria-label={ariaLabel}
                aria-multiline="true"
                aria-readonly={readOnly}
                aria-disabled={disabled}
                id={id}
                data-placeholder={placeholder}
            />
        </div>
    )
}

export default RichTextEditor
