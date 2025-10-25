# RichTextEditor Integration Guide

Quick reference for integrating the RichTextEditor component into your applications.

## Quick Start

```tsx
import { RichTextEditor } from '@frauschert/my-awesome-component-library'

function MyApp() {
    const [content, setContent] = useState('')

    return (
        <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing..."
        />
    )
}
```

## Common Use Cases

### 1. Blog Post Editor

```tsx
import {
    RichTextEditor,
    Card,
    Button,
} from '@frauschert/my-awesome-component-library'

function BlogEditor() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handlePublish = async () => {
        await api.posts.create({ title, content })
    }

    return (
        <Card>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
            />
            <RichTextEditor
                value={content}
                onChange={setContent}
                minHeight="500px"
                placeholder="Write your blog post..."
            />
            <Button onClick={handlePublish}>Publish</Button>
        </Card>
    )
}
```

### 2. Comment System

```tsx
function CommentBox({ onSubmit }) {
    const [comment, setComment] = useState('')

    return (
        <div>
            <RichTextEditor
                value={comment}
                onChange={setComment}
                minHeight="100px"
                placeholder="Add a comment..."
                toolbarItems={['bold', 'italic', 'link', 'code']}
            />
            <Button onClick={() => onSubmit(comment)}>Post Comment</Button>
        </div>
    )
}
```

### 3. Email Composer

```tsx
function EmailForm() {
    const [email, setEmail] = useState({
        to: '',
        subject: '',
        body: '',
    })

    return (
        <form>
            <input
                type="email"
                value={email.to}
                onChange={(e) => setEmail({ ...email, to: e.target.value })}
                placeholder="To:"
            />
            <input
                type="text"
                value={email.subject}
                onChange={(e) =>
                    setEmail({ ...email, subject: e.target.value })
                }
                placeholder="Subject:"
            />
            <RichTextEditor
                value={email.body}
                onChange={(body) => setEmail({ ...email, body })}
                minHeight="300px"
            />
            <Button type="submit">Send</Button>
        </form>
    )
}
```

### 4. Documentation Editor

```tsx
function DocsEditor() {
    const [doc, setDoc] = useState('')

    return (
        <RichTextEditor
            value={doc}
            onChange={setDoc}
            minHeight="600px"
            toolbarItems={[
                'bold',
                'italic',
                'underline',
                'h1',
                'h2',
                'h3',
                'orderedList',
                'unorderedList',
                'code',
                'codeBlock',
                'link',
                'image',
                'blockquote',
                'horizontalRule',
            ]}
        />
    )
}
```

## Best Practices

### 1. Sanitize User Input

Always sanitize HTML from untrusted sources:

```tsx
import DOMPurify from 'dompurify'

function SafeEditor() {
    const [content, setContent] = useState('')

    const handleChange = (html: string) => {
        const clean = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'p',
                'br',
                'strong',
                'em',
                'u',
                'a',
                'ul',
                'ol',
                'li',
            ],
            ALLOWED_ATTR: ['href', 'target'],
        })
        setContent(clean)
    }

    return <RichTextEditor value={content} onChange={handleChange} />
}
```

### 2. Auto-Save Drafts

```tsx
import { useEffect } from 'react'
import { debounce } from 'lodash'

function DraftEditor() {
    const [content, setContent] = useState('')

    useEffect(() => {
        const saveDraft = debounce((html: string) => {
            localStorage.setItem('draft', html)
        }, 1000)

        if (content) {
            saveDraft(content)
        }

        return () => saveDraft.cancel()
    }, [content])

    return <RichTextEditor value={content} onChange={setContent} />
}
```

### 3. Character/Word Count

```tsx
function CountedEditor() {
    const [html, setHtml] = useState('')

    const getTextContent = (html: string) => {
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || ''
    }

    const text = getTextContent(html)
    const wordCount = text.split(/\s+/).filter(Boolean).length

    return (
        <div>
            <RichTextEditor value={html} onChange={setHtml} />
            <div style={{ textAlign: 'right', color: '#6c757d' }}>
                {text.length} characters · {wordCount} words
            </div>
        </div>
    )
}
```

### 4. Validation

```tsx
function ValidatedEditor({ minLength = 10 }) {
    const [content, setContent] = useState('')
    const [error, setError] = useState('')

    const handleChange = (html: string) => {
        setContent(html)

        const text = html.replace(/<[^>]*>/g, '')
        if (text.length < minLength) {
            setError(`Content must be at least ${minLength} characters`)
        } else {
            setError('')
        }
    }

    return (
        <div>
            <RichTextEditor value={content} onChange={handleChange} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    )
}
```

### 5. With Form Integration

```tsx
import { useForm, Controller } from 'react-hook-form'

function FormWithEditor() {
    const { control, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log('Content:', data.content)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="content"
                control={control}
                rules={{ required: 'Content is required' }}
                render={({ field, fieldState }) => (
                    <div>
                        <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                        />
                        {fieldState.error && (
                            <span style={{ color: 'red' }}>
                                {fieldState.error.message}
                            </span>
                        )}
                    </div>
                )}
            />
            <button type="submit">Submit</button>
        </form>
    )
}
```

## Customization Examples

### Minimal Editor for Comments

```tsx
<RichTextEditor
    minHeight="80px"
    placeholder="Write a comment..."
    toolbarItems={['bold', 'italic', 'link']}
/>
```

### Full-Featured Editor

```tsx
<RichTextEditor
    minHeight="500px"
    toolbarItems={[
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
        'image',
        'code',
        'codeBlock',
        'horizontalRule',
        'undo',
        'redo',
        'clear',
    ]}
/>
```

### Read-Only Viewer

```tsx
<RichTextEditor readOnly showToolbar={false} value={savedContent} />
```

## Performance Tips

### 1. Debounce onChange for Large Documents

```tsx
const debouncedSave = useMemo(
    () => debounce((value: string) => {
        saveToServer(value)
    }, 500),
    []
)

<RichTextEditor onChange={debouncedSave} />
```

### 2. Lazy Loading

```tsx
const RichTextEditor = lazy(() => import('./components/RichTextEditor'))

function LazyEditor() {
    return (
        <Suspense fallback={<Skeleton height="300px" />}>
            <RichTextEditor />
        </Suspense>
    )
}
```

## Accessibility

The editor is fully accessible out of the box:

```tsx
<RichTextEditor
    ariaLabel="Blog post content"
    id="post-content"
    autoFocus // For user convenience
/>
```

## Theming

Works seamlessly with your theme system:

```tsx
import {
    ThemeProvider,
    RichTextEditor,
} from '@frauschert/my-awesome-component-library'

function ThemedApp() {
    return (
        <ThemeProvider>
            <RichTextEditor />
        </ThemeProvider>
    )
}
```

## Server-Side Rendering

Safe for SSR frameworks like Next.js:

```tsx
// Next.js example
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(
    () =>
        import('@frauschert/my-awesome-component-library').then(
            (mod) => mod.RichTextEditor
        ),
    { ssr: false }
)
```

## Storage

### Save to Database

```tsx
async function saveContent(html: string) {
    await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: html }),
    })
}
```

### Load from Database

```tsx
useEffect(() => {
    async function loadContent() {
        const response = await fetch('/api/content')
        const data = await response.json()
        setContent(data.content)
    }
    loadContent()
}, [])
```

## Migration from Other Editors

### From Textarea

```tsx
// Before
<textarea value={content} onChange={(e) => setContent(e.target.value)} />

// After
<RichTextEditor value={content} onChange={setContent} />
```

### From Quill

```tsx
// Before
<ReactQuill value={content} onChange={setContent} />

// After
<RichTextEditor value={content} onChange={setContent} />
```

## Troubleshooting

### Content Not Updating

Make sure you're using controlled mode correctly:

```tsx
// ✅ Correct
const [content, setContent] = useState('')
<RichTextEditor value={content} onChange={setContent} />

// ❌ Wrong
const [content, setContent] = useState('')
<RichTextEditor defaultValue={content} /> // Use value, not defaultValue
```

### Links Not Working

Ensure you're sanitizing but allowing `<a>` tags:

```tsx
DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [..., 'a'],
    ALLOWED_ATTR: ['href', 'target']
})
```

### Styling Issues

Import the component's styles:

```tsx
import '@frauschert/my-awesome-component-library/lib/index.css'
```
