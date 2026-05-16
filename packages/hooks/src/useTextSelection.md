# useTextSelection

A hook for tracking text selection in the document or within a specific element. Provides detailed information about the current selection including text content, position, and ranges.

## Features

-   ✅ Track selection in entire document or specific element
-   ✅ Get selected text content
-   ✅ Access bounding rectangles for positioning tooltips/popovers
-   ✅ Access raw Selection API and Range objects
-   ✅ Detect collapsed selections (cursor position)
-   ✅ Enable/disable tracking dynamically
-   ✅ Type-safe with TypeScript

## Basic Usage

```tsx
import { useTextSelection } from '@your-org/component-library'

function SelectionTracker() {
    const selection = useTextSelection()

    return (
        <div>
            {selection.hasSelection ? (
                <div>
                    <p>Selected text: "{selection.text}"</p>
                    <p>Length: {selection.text.length} characters</p>
                </div>
            ) : (
                <p>No text selected</p>
            )}
        </div>
    )
}
```

## Track Selection in Specific Element

Limit selection tracking to a specific container:

```tsx
function ContentEditor() {
    const ref = useRef<HTMLDivElement>(null)
    const selection = useTextSelection({ ref })

    return (
        <div>
            <div ref={ref} style={{ border: '1px solid gray', padding: 20 }}>
                <p>Select text within this container only.</p>
                <p>Selections outside won't be tracked.</p>
            </div>

            {selection.hasSelection && (
                <div style={{ marginTop: 10 }}>
                    Selected: "{selection.text}"
                </div>
            )}
        </div>
    )
}
```

## Position Tooltip at Selection

Use bounding rectangles to position UI elements:

```tsx
function SelectionTooltip() {
    const selection = useTextSelection()

    return (
        <div>
            <p>Select some text to see a tooltip</p>

            {selection.hasSelection && selection.rects[0] && (
                <div
                    style={{
                        position: 'fixed',
                        top: selection.rects[0].top - 40,
                        left: selection.rects[0].left,
                        background: 'black',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: 4,
                        fontSize: 12,
                    }}
                >
                    {selection.text.length} characters selected
                </div>
            )}
        </div>
    )
}
```

## Floating Actions Menu

Show actions when text is selected:

```tsx
function TextActions() {
    const selection = useTextSelection()

    const handleBold = () => {
        console.log('Make bold:', selection.text)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(selection.text)
    }

    return (
        <div>
            <div contentEditable style={{ padding: 20, border: '1px solid' }}>
                Select text in this editable area
            </div>

            {selection.hasSelection && selection.rects[0] && (
                <div
                    style={{
                        position: 'fixed',
                        top: selection.rects[0].bottom + 10,
                        left: selection.rects[0].left,
                        display: 'flex',
                        gap: 5,
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        borderRadius: 4,
                        padding: 5,
                    }}
                >
                    <button onClick={handleBold}>Bold</button>
                    <button onClick={handleCopy}>Copy</button>
                </div>
            )}
        </div>
    )
}
```

## Conditional Tracking

Enable/disable tracking based on state:

```tsx
function ConditionalTracker() {
    const [isEnabled, setIsEnabled] = useState(true)
    const selection = useTextSelection({ isEnabled })

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                />
                Enable selection tracking
            </label>

            <p>Try selecting this text</p>

            {selection.hasSelection && <div>Selected: "{selection.text}"</div>}
        </div>
    )
}
```

## Highlight Selected Text

Create a custom highlight effect:

```tsx
function SelectionHighlighter() {
    const ref = useRef<HTMLDivElement>(null)
    const selection = useTextSelection({ ref })

    return (
        <div ref={ref} style={{ position: 'relative', padding: 20 }}>
            <p>
                Select any text in this paragraph and you'll see the coordinates
                and details of your selection. This is useful for building rich
                text editors or annotation tools.
            </p>

            {selection.rects.map((rect, index) => (
                <div
                    key={index}
                    style={{
                        position: 'fixed',
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        background: 'rgba(255, 255, 0, 0.3)',
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {selection.hasSelection && (
                <div style={{ marginTop: 20 }}>
                    <strong>Selection Details:</strong>
                    <ul>
                        <li>Text: "{selection.text}"</li>
                        <li>Length: {selection.text.length}</li>
                        <li>Rectangles: {selection.rects.length}</li>
                        <li>Ranges: {selection.ranges.length}</li>
                    </ul>
                </div>
            )}
        </div>
    )
}
```

## Advanced: Access Raw Selection API

Work directly with Selection and Range objects:

```tsx
function AdvancedSelection() {
    const selection = useTextSelection()

    const getSelectionInfo = () => {
        if (!selection.selection) return null

        return {
            anchorNode: selection.anchorNode?.nodeName,
            anchorOffset: selection.anchorOffset,
            focusNode: selection.focusNode?.nodeName,
            focusOffset: selection.focusOffset,
            isCollapsed: selection.isCollapsed,
            rangeCount: selection.ranges.length,
        }
    }

    return (
        <div>
            <p>Select text to see advanced details</p>

            {selection.hasSelection && (
                <pre>{JSON.stringify(getSelectionInfo(), null, 2)}</pre>
            )}
        </div>
    )
}
```

## Building a Commenting System

Show comment dialog at selection:

```tsx
function CommentSystem() {
    const [comments, setComments] = useState<
        Array<{ text: string; comment: string }>
    >([])
    const [showDialog, setShowDialog] = useState(false)
    const [currentSelection, setCurrentSelection] = useState<string>('')

    const selection = useTextSelection()

    useEffect(() => {
        if (selection.hasSelection) {
            setShowDialog(true)
            setCurrentSelection(selection.text)
        } else {
            setShowDialog(false)
        }
    }, [selection.hasSelection, selection.text])

    const handleAddComment = (comment: string) => {
        setComments([...comments, { text: currentSelection, comment }])
        setShowDialog(false)
    }

    return (
        <div>
            <div style={{ padding: 20 }}>
                <p>
                    Select any text in this document to add a comment. This is
                    how annotation tools like Google Docs comments work.
                </p>
            </div>

            {showDialog && selection.rects[0] && (
                <div
                    style={{
                        position: 'fixed',
                        top: selection.rects[0].bottom + 10,
                        left: selection.rects[0].left,
                        background: 'white',
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        padding: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        minWidth: 200,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddComment(e.currentTarget.value)
                            }
                        }}
                    />
                </div>
            )}

            {comments.length > 0 && (
                <div style={{ marginTop: 20, padding: 20 }}>
                    <h3>Comments:</h3>
                    {comments.map((c, i) => (
                        <div key={i} style={{ marginBottom: 10 }}>
                            <strong>"{c.text}"</strong>: {c.comment}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
```

## Multi-line Selections

Handle selections that span multiple lines:

```tsx
function MultiLineSelection() {
    const selection = useTextSelection()

    return (
        <div>
            <div style={{ padding: 20, lineHeight: 1.8 }}>
                <p>
                    Try selecting across multiple lines in this paragraph. Each
                    line will have its own bounding rectangle, which you can use
                    to create highlights or annotations that follow the text
                    flow.
                </p>
            </div>

            {selection.hasSelection && (
                <div style={{ marginTop: 20 }}>
                    <p>Selection spans {selection.rects.length} line(s)</p>
                    {selection.rects.map((rect, i) => (
                        <div key={i}>
                            Line {i + 1}: {Math.round(rect.width)}px wide
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
```

## API Reference

### useTextSelection(options?)

#### Options

| Option      | Type                     | Default | Description                        |
| ----------- | ------------------------ | ------- | ---------------------------------- |
| `ref`       | `RefObject<HTMLElement>` | -       | Limit tracking to specific element |
| `isEnabled` | `boolean`                | `true`  | Enable/disable selection tracking  |

#### Return Value (TextSelectionState)

| Property       | Type        | Description                             |
| -------------- | ----------- | --------------------------------------- | --------------------------- |
| `text`         | `string`    | Selected text content                   |
| `hasSelection` | `boolean`   | Whether any text is selected            |
| `isCollapsed`  | `boolean`   | Whether selection is collapsed (cursor) |
| `rects`        | `DOMRect[]` | Bounding rectangles for each line       |
| `ranges`       | `Range[]`   | Raw Range objects                       |
| `selection`    | `Selection  | null`                                   | Raw Selection object        |
| `anchorNode`   | `Node       | null`                                   | Node where selection starts |
| `anchorOffset` | `number`    | Character offset where selection starts |
| `focusNode`    | `Node       | null`                                   | Node where selection ends   |
| `focusOffset`  | `number`    | Character offset where selection ends   |

## Use Cases

-   **Rich Text Editors**: Show formatting toolbar at selection
-   **Annotation Tools**: Add comments/notes to selected text
-   **Text Highlighting**: Create highlights or marks
-   **Context Menus**: Show relevant actions for selected text
-   **Copy/Share Tools**: Share or process selected content
-   **Reading Tools**: Show definitions, translations, or explanations
-   **Analytics**: Track what users select for insights
-   **Accessibility**: Provide selection-based navigation aids

## Notes

-   Selection tracking uses the native `selectionchange` and `mouseup` events
-   Bounding rectangles are in viewport coordinates (fixed positioning)
-   Multiple rectangles occur when selection spans multiple lines
-   The hook automatically cleans up event listeners on unmount
-   When `ref` is provided, only selections within that element are tracked
-   Collapsed selections (cursor position) are tracked but have empty text
-   Works with both mouse and keyboard selection
