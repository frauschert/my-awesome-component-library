# RichTextEditor

A comprehensive WYSIWYG (What You See Is What You Get) rich text editor component with full formatting capabilities, customizable toolbar, and excellent accessibility.

## Features

-   📝 **Full Formatting** - Bold, italic, underline, strikethrough, headings, lists, blockquotes
-   🔗 **Links & Images** - Insert and edit hyperlinks and images
-   🛠️ **Customizable Toolbar** - Choose which formatting options to display
-   🎨 **Theming** - Fully themed with CSS custom properties
-   ♿ **Accessible** - Complete keyboard navigation and ARIA support
-   📱 **Responsive** - Works great on mobile and desktop
-   🎯 **Controlled & Uncontrolled** - Supports both modes
-   🌓 **Dark Mode** - Automatic theme adaptation

## Installation

```tsx
import RichTextEditor from './components/RichTextEditor'
```

## Basic Usage

### Uncontrolled (Default Value)

```tsx
<RichTextEditor
    defaultValue="<p>Initial content</p>"
    placeholder="Start typing..."
    onChange={(html) => console.log(html)}
/>
```

### Controlled

```tsx
function MyComponent() {
    const [content, setContent] = useState('<p>Hello world</p>')

    return <RichTextEditor value={content} onChange={setContent} />
}
```

## Props

| Prop           | Type                    | Default              | Description                         |
| -------------- | ----------------------- | -------------------- | ----------------------------------- |
| `value`        | string                  | -                    | Controlled HTML content             |
| `defaultValue` | string                  | `''`                 | Initial HTML content (uncontrolled) |
| `onChange`     | (value: string) => void | -                    | Callback when content changes       |
| `placeholder`  | string                  | `'Start typing...'`  | Placeholder text when empty         |
| `disabled`     | boolean                 | `false`              | Disable editing                     |
| `readOnly`     | boolean                 | `false`              | Make content read-only              |
| `autoFocus`    | boolean                 | `false`              | Auto-focus on mount                 |
| `minHeight`    | string \| number        | `'200px'`            | Minimum editor height               |
| `maxHeight`    | string \| number        | -                    | Maximum editor height               |
| `showToolbar`  | boolean                 | `true`               | Show/hide toolbar                   |
| `toolbarItems` | ToolbarItem[]           | all items            | Toolbar buttons to display          |
| `className`    | string                  | `''`                 | Additional CSS class                |
| `id`           | string                  | -                    | Element ID                          |
| `ariaLabel`    | string                  | `'Rich text editor'` | ARIA label                          |

## Toolbar Items

Available toolbar items:

```typescript
type ToolbarItem =
    | 'bold' // Bold text
    | 'italic' // Italic text
    | 'underline' // Underline text
    | 'strikethrough' // Strikethrough text
    | 'h1' // Heading 1
    | 'h2' // Heading 2
    | 'h3' // Heading 3
    | 'paragraph' // Paragraph
    | 'orderedList' // Numbered list
    | 'unorderedList' // Bullet list
    | 'blockquote' // Quote block
    | 'link' // Insert link
    | 'image' // Insert image
    | 'code' // Inline code
    | 'codeBlock' // Code block
    | 'horizontalRule' // Horizontal line
    | 'undo' // Undo action
    | 'redo' // Redo action
    | 'clear' // Clear formatting
```

## Examples

### Custom Toolbar

```tsx
<RichTextEditor
    toolbarItems={['bold', 'italic', 'link', 'clear']}
    placeholder="Minimal editor..."
/>
```

### Comment Editor

```tsx
<RichTextEditor
    minHeight="100px"
    placeholder="Write a comment..."
    toolbarItems={['bold', 'italic', 'link', 'code']}
/>
```

### Blog Post Editor

```tsx
<RichTextEditor
    minHeight="500px"
    placeholder="Write your blog post..."
    toolbarItems={[
        'bold',
        'italic',
        'underline',
        'h1',
        'h2',
        'h3',
        'orderedList',
        'unorderedList',
        'blockquote',
        'link',
        'image',
        'code',
        'codeBlock',
        'horizontalRule',
    ]}
/>
```

### Email Composer

```tsx
function EmailComposer() {
    const [body, setBody] = useState('')

    return (
        <div>
            <input type="email" placeholder="To:" />
            <input type="text" placeholder="Subject:" />
            <RichTextEditor
                value={body}
                onChange={setBody}
                minHeight="300px"
                placeholder="Compose your email..."
                toolbarItems={[
                    'bold',
                    'italic',
                    'underline',
                    'h2',
                    'h3',
                    'unorderedList',
                    'orderedList',
                    'link',
                    'image',
                ]}
            />
            <button onClick={() => sendEmail(body)}>Send</button>
        </div>
    )
}
```

### Without Toolbar

```tsx
<RichTextEditor showToolbar={false} placeholder="Plain editor..." />
```

### Read-Only Display

```tsx
<RichTextEditor readOnly value={savedContent} />
```

### Disabled State

```tsx
<RichTextEditor disabled value={content} />
```

### Custom Height

```tsx
<RichTextEditor minHeight="400px" maxHeight="800px" />
```

### Auto-Focus

```tsx
<RichTextEditor autoFocus placeholder="Starts focused..." />
```

## Styling

### Custom Styles

```tsx
<RichTextEditor className="my-custom-editor" minHeight="300px" />
```

```css
.my-custom-editor {
    border: 2px solid blue;
    border-radius: 8px;
}
```

### Theme Variables

Override theme variables:

```css
.rich-text-editor {
    --theme-primary: #ff6b6b;
    --theme-border: #e9ecef;
    --theme-bg-primary: #ffffff;
}
```

## Output Format

The editor outputs HTML strings:

```tsx
function MyComponent() {
    const [html, setHtml] = useState('')

    return (
        <>
            <RichTextEditor onChange={setHtml} />

            {/* Display HTML */}
            <div dangerouslySetInnerHTML={{ __html: html }} />

            {/* Or show raw HTML */}
            <pre>{html}</pre>
        </>
    )
}
```

Example output:

```html
<h1>My Title</h1>
<p>This is <strong>bold</strong> and <em>italic</em> text.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
<blockquote>A famous quote</blockquote>
```

## Keyboard Shortcuts

Native browser shortcuts work:

-   **Ctrl/Cmd + B** - Bold
-   **Ctrl/Cmd + I** - Italic
-   **Ctrl/Cmd + U** - Underline
-   **Ctrl/Cmd + Z** - Undo
-   **Ctrl/Cmd + Shift + Z** - Redo
-   **Tab** - Navigate toolbar (when focused)

## Accessibility

The component follows WAI-ARIA guidelines:

-   Proper roles (`textbox`, `toolbar`)
-   ARIA labels for all controls
-   Keyboard navigation support
-   Screen reader friendly
-   Focus management

```tsx
<RichTextEditor ariaLabel="Blog post content editor" id="post-editor" />
```

## Browser Support

Uses `contentEditable` and `document.execCommand()`:

-   ✅ Chrome/Edge 90+
-   ✅ Firefox 88+
-   ✅ Safari 14+
-   ✅ Mobile browsers

## Sanitization

⚠️ **Important**: The editor outputs raw HTML. Always sanitize user-generated content before storing or displaying:

```tsx
import DOMPurify from 'dompurify'

function MyComponent() {
    const [html, setHtml] = useState('')

    const handleChange = (value: string) => {
        const clean = DOMPurify.sanitize(value)
        setHtml(clean)
    }

    return <RichTextEditor onChange={handleChange} />
}
```

## Performance

For large documents:

```tsx
import { debounce } from 'lodash'

function MyComponent() {
    const [content, setContent] = useState('')

    const debouncedSave = useMemo(
        () =>
            debounce((value: string) => {
                saveToServer(value)
            }, 500),
        []
    )

    return (
        <RichTextEditor
            value={content}
            onChange={(value) => {
                setContent(value)
                debouncedSave(value)
            }}
        />
    )
}
```

## Limitations

-   Uses native `execCommand` API (deprecated but widely supported)
-   Link/image insertion uses `prompt()` (can be customized)
-   No built-in image upload (URLs only)
-   No collaborative editing
-   No table support

For more advanced features, consider libraries like:

-   Slate.js
-   Draft.js
-   TipTap
-   Quill

## TypeScript

Full TypeScript support:

```typescript
import RichTextEditor, {
    RichTextEditorProps,
    ToolbarItem,
} from './components/RichTextEditor'

const customItems: ToolbarItem[] = ['bold', 'italic', 'link']

const props: RichTextEditorProps = {
    value: '<p>Hello</p>',
    onChange: (value: string) => console.log(value),
    toolbarItems: customItems,
}
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RichTextEditor from './RichTextEditor'

test('renders editor', () => {
    render(<RichTextEditor />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
})

test('calls onChange', () => {
    const handleChange = jest.fn()
    render(<RichTextEditor onChange={handleChange} />)

    const editor = screen.getByRole('textbox')
    fireEvent.input(editor)

    expect(handleChange).toHaveBeenCalled()
})
```

## Common Patterns

### Auto-Save Draft

```tsx
function DraftEditor() {
    const [content, setContent] = useState('')

    useEffect(() => {
        const timer = setInterval(() => {
            if (content) {
                localStorage.setItem('draft', content)
            }
        }, 5000)
        return () => clearInterval(timer)
    }, [content])

    return <RichTextEditor value={content} onChange={setContent} />
}
```

### Character Count

```tsx
function CountedEditor() {
    const [html, setHtml] = useState('')
    const textContent = html.replace(/<[^>]*>/g, '')

    return (
        <>
            <RichTextEditor onChange={setHtml} />
            <div>{textContent.length} characters</div>
        </>
    )
}
```

### Validation

```tsx
function ValidatedEditor() {
    const [content, setContent] = useState('')
    const [error, setError] = useState('')

    const handleChange = (value: string) => {
        setContent(value)
        const text = value.replace(/<[^>]*>/g, '')
        if (text.length < 10) {
            setError('Content must be at least 10 characters')
        } else {
            setError('')
        }
    }

    return (
        <>
            <RichTextEditor value={content} onChange={handleChange} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </>
    )
}
```
