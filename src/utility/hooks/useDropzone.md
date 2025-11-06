# useDropzone

A comprehensive hook for creating drag-and-drop file upload zones with validation, keyboard accessibility, and multiple interaction modes.

## Features

-   🎯 **Drag & Drop**: Full drag-and-drop support with visual feedback
-   ✅ **File Validation**: Type, size, and count validation
-   ⌨️ **Keyboard Accessible**: Full keyboard navigation support
-   📦 **Multiple Files**: Support for single or multiple file uploads
-   🎨 **State Tracking**: Track drag states (active, accept, reject)
-   🔒 **Disabled State**: Fully disabled mode
-   🎭 **Flexible UI**: Prop getters for easy integration
-   📝 **TypeScript**: Full type safety with generics

## Basic Usage

```tsx
import { useDropzone } from 'my-awesome-component-library'

function FileUploader() {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
            onDrop: (files) => {
                console.log('Dropped files:', files)
            },
        })

    return (
        <div
            {...getRootProps()}
            style={{ border: '2px dashed #ccc', padding: '20px' }}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here...</p>
            ) : (
                <p>Drag & drop files here, or click to select files</p>
            )}
            {acceptedFiles.length > 0 && (
                <ul>
                    {acceptedFiles.map((file) => (
                        <li key={file.name}>
                            {file.name} - {file.size} bytes
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
```

## Accept Specific File Types

```tsx
function ImageUploader() {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: 'image/*',
        onDrop: (files) => {
            files.forEach((file) => {
                const reader = new FileReader()
                reader.onload = () => {
                    console.log('Image loaded:', reader.result)
                }
                reader.readAsDataURL(file)
            })
        },
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop images here</p>
            {acceptedFiles.map((file) => (
                <img
                    key={file.name}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ maxWidth: '200px' }}
                />
            ))}
        </div>
    )
}
```

## Multiple Accept Types

```tsx
function DocumentUploader() {
    const dropzone = useDropzone({
        accept: ['application/pdf', '.doc', '.docx'],
        onDrop: (files) => console.log('Documents:', files),
    })

    return (
        <div {...dropzone.getRootProps()}>
            <input {...dropzone.getInputProps()} />
            <p>Drop PDF or Word documents here</p>
        </div>
    )
}
```

## File Size Validation

```tsx
function SizeLimitedUploader() {
    const { getRootProps, getInputProps, acceptedFiles, rejectedFiles } =
        useDropzone({
            maxSize: 5 * 1024 * 1024, // 5MB
            minSize: 1024, // 1KB
            onDrop: (files) => console.log('Accepted:', files),
            onDropRejected: (files) => {
                alert(
                    `${files.length} file(s) rejected: size must be between 1KB and 5MB`
                )
            },
        })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Max file size: 5MB, Min: 1KB</p>

            {acceptedFiles.length > 0 && (
                <div>
                    <h4>Accepted:</h4>
                    <ul>
                        {acceptedFiles.map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {rejectedFiles.length > 0 && (
                <div style={{ color: 'red' }}>
                    <h4>Rejected:</h4>
                    <ul>
                        {rejectedFiles.map((file) => (
                            <li key={file.name}>
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
```

## Limit Number of Files

```tsx
function SingleFileUploader() {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        multiple: false,
        onDrop: (files) => console.log('File:', files[0]),
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {acceptedFiles.length === 0 ? (
                <p>Drop a single file here</p>
            ) : (
                <p>Selected: {acceptedFiles[0].name}</p>
            )}
        </div>
    )
}

function LimitedMultipleUploader() {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 3,
        onDrop: (files) => console.log('Files:', files),
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop up to 3 files (selected: {acceptedFiles.length}/3)</p>
        </div>
    )
}
```

## Visual Feedback for Drag States

```tsx
function StyledDropzone() {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: 'image/*',
        onDrop: (files) => console.log(files),
    })

    const baseStyle = {
        border: '2px dashed #ccc',
        padding: '40px',
        transition: 'all 0.2s',
    }

    const activeStyle = {
        borderColor: '#2196f3',
        backgroundColor: '#e3f2fd',
    }

    const acceptStyle = {
        borderColor: '#4caf50',
        backgroundColor: '#e8f5e9',
    }

    const rejectStyle = {
        borderColor: '#f44336',
        backgroundColor: '#ffebee',
    }

    const style = {
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
    }

    return (
        <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {isDragAccept && <p>✓ Drop to upload</p>}
            {isDragReject && <p>✗ File type not accepted</p>}
            {!isDragActive && <p>Drag images here or click to browse</p>}
        </div>
    )
}
```

## Disabled State

```tsx
function ConditionalUploader() {
    const [uploading, setUploading] = useState(false)

    const { getRootProps, getInputProps } = useDropzone({
        disabled: uploading,
        onDrop: async (files) => {
            setUploading(true)
            try {
                await uploadFiles(files)
            } finally {
                setUploading(false)
            }
        },
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {uploading ? <p>Uploading...</p> : <p>Drop files here</p>}
        </div>
    )
}
```

## Programmatic File Selection

```tsx
function ControlledUploader() {
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        noClick: true, // Disable click on root
        noKeyboard: true, // Disable keyboard on root
        onDrop: (files) => console.log(files),
    })

    return (
        <div>
            <div
                {...getRootProps()}
                style={{ border: '2px dashed #ccc', padding: '20px' }}
            >
                <input {...getInputProps()} />
                <p>Drag & drop only - click disabled</p>
            </div>

            <button onClick={open} style={{ marginTop: '10px' }}>
                Open File Dialog
            </button>

            {acceptedFiles.length > 0 && (
                <ul>
                    {acceptedFiles.map((file) => (
                        <li key={file.name}>{file.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
```

## Drag Only (No Click)

```tsx
function DragOnlyUploader() {
    const { getRootProps, getInputProps } = useDropzone({
        noDrag: false,
        noClick: true,
        noKeyboard: true,
        onDrop: (files) => console.log(files),
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag & drop only - clicking will not open file dialog</p>
        </div>
    )
}
```

## Avatar Upload with Preview

```tsx
function AvatarUploader() {
    const [preview, setPreview] = useState<string | null>(null)

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        maxSize: 2 * 1024 * 1024, // 2MB
        onDrop: (files) => {
            const file = files[0]
            if (file) {
                const url = URL.createObjectURL(file)
                setPreview(url)
            }
        },
        onDropRejected: () => {
            alert('Please upload a single image under 2MB')
        },
    })

    return (
        <div>
            <div
                {...getRootProps()}
                style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                }}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <img src={preview} alt="Avatar" style={{ width: '100%' }} />
                ) : (
                    <p>Add Photo</p>
                )}
            </div>
        </div>
    )
}
```

## Batch File Upload with Progress

```tsx
function BatchUploader() {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDrop: (newFiles) => {
            setFiles((prev) => [...prev, ...newFiles])
        },
    })

    const handleUpload = async () => {
        setUploading(true)
        try {
            // Upload files...
            await Promise.all(files.map(uploadFile))
            setFiles([])
        } finally {
            setUploading(false)
        }
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div>
            <div
                {...getRootProps()}
                style={{ border: '2px dashed #ccc', padding: '20px' }}
            >
                <input {...getInputProps()} />
                <p>Drop files here to add to queue</p>
            </div>

            {files.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Files to upload ({files.length}):</h4>
                    <ul>
                        {files.map((file, index) => (
                            <li key={`${file.name}-${index}`}>
                                {file.name} - {(file.size / 1024).toFixed(2)} KB
                                <button onClick={() => removeFile(index)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload All'}
                    </button>
                </div>
            )}
        </div>
    )
}
```

## CSV/Excel File Upload

```tsx
function DataFileUploader() {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: ['.csv', '.xlsx', '.xls'],
        maxFiles: 1,
        onDrop: async (files) => {
            const file = files[0]
            if (file) {
                // Parse CSV/Excel file
                const text = await file.text()
                console.log('File content:', text)
            }
        },
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop CSV or Excel file here</p>
            {acceptedFiles[0] && <p>Selected: {acceptedFiles[0].name}</p>}
        </div>
    )
}
```

## API

### Parameters

```typescript
interface UseDropzoneOptions {
    onDrop?: (files: File[]) => void
    onDropRejected?: (files: File[]) => void
    accept?: string | string[]
    maxSize?: number
    minSize?: number
    maxFiles?: number
    multiple?: boolean
    disabled?: boolean
    noClick?: boolean
    noKeyboard?: boolean
    noDrag?: boolean
}
```

#### `onDrop`

-   **Type**: `(files: File[]) => void`
-   **Optional**: Yes
-   **Description**: Callback when files are successfully dropped and validated

#### `onDropRejected`

-   **Type**: `(files: File[]) => void`
-   **Optional**: Yes
-   **Description**: Callback when files fail validation

#### `accept`

-   **Type**: `string | string[]`
-   **Optional**: Yes
-   **Description**: Accepted file types. Can be MIME types (`'image/*'`, `'image/png'`) or extensions (`'.jpg'`, `'.pdf'`)
-   **Examples**: `'image/*'`, `['image/png', 'image/jpeg']`, `['.pdf', '.doc']`

#### `maxSize`

-   **Type**: `number`
-   **Optional**: Yes
-   **Default**: `Infinity`
-   **Description**: Maximum file size in bytes

#### `minSize`

-   **Type**: `number`
-   **Optional**: Yes
-   **Default**: `0`
-   **Description**: Minimum file size in bytes

#### `maxFiles`

-   **Type**: `number`
-   **Optional**: Yes
-   **Default**: `0` (unlimited)
-   **Description**: Maximum number of files to accept. Set to `1` for single file upload

#### `multiple`

-   **Type**: `boolean`
-   **Optional**: Yes
-   **Default**: `true`
-   **Description**: Allow multiple file selection

#### `disabled`

-   **Type**: `boolean`
-   **Optional**: Yes
-   **Default**: `false`
-   **Description**: Disable all dropzone interactions

#### `noClick`

-   **Type**: `boolean`
-   **Optional**: Yes
-   **Default**: `false`
-   **Description**: Disable click to open file dialog

#### `noKeyboard`

-   **Type**: `boolean`
-   **Optional**: Yes
-   **Default**: `false`
-   **Description**: Disable keyboard (Enter/Space) to open file dialog

#### `noDrag`

-   **Type**: `boolean`
-   **Optional**: Yes
-   **Default**: `false`
-   **Description**: Disable drag and drop functionality

### Return Value

```typescript
interface UseDropzoneReturn {
    // Prop getters
    getRootProps: () => RootProps
    getInputProps: () => InputProps

    // Refs
    rootRef: React.RefObject<HTMLElement | null>
    inputRef: React.RefObject<HTMLInputElement | null>

    // State
    isDragActive: boolean
    isDragAccept: boolean
    isDragReject: boolean

    // Files
    acceptedFiles: File[]
    rejectedFiles: File[]

    // Methods
    open: () => void
}
```

#### `getRootProps()`

Returns props to spread on the dropzone container element

#### `getInputProps()`

Returns props to spread on the hidden file input element

#### `rootRef`

Ref to the root dropzone element

#### `inputRef`

Ref to the hidden file input element

#### `isDragActive`

`true` when files are being dragged over the dropzone

#### `isDragAccept`

`true` when dragged files match validation criteria

#### `isDragReject`

`true` when dragged files fail validation criteria

#### `acceptedFiles`

Array of files that passed validation

#### `rejectedFiles`

Array of files that failed validation

#### `open()`

Programmatically open the file selection dialog

## Use Cases

-   **Image Uploaders**: Avatar uploads, photo galleries
-   **Document Management**: PDF, Word, Excel file uploads
-   **Bulk Uploads**: Multiple file uploads with queue management
-   **Form Integration**: File upload fields in forms
-   **Drag & Drop UIs**: Modern file upload interfaces
-   **Data Import**: CSV/Excel data imports
-   **Media Libraries**: Audio/video file uploads
-   **Profile Management**: Profile picture uploads

## TypeScript

The hook is fully typed with TypeScript:

```typescript
import {
    useDropzone,
    UseDropzoneOptions,
    UseDropzoneReturn,
} from 'my-awesome-component-library'

const options: UseDropzoneOptions = {
    accept: 'image/*',
    maxSize: 5242880,
    onDrop: (files: File[]) => {
        console.log(files)
    },
}

const dropzone: UseDropzoneReturn = useDropzone(options)
```
