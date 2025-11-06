import { useState, useCallback, useRef, useMemo, DragEvent } from 'react'

export interface UseDropzoneOptions {
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
    preventDropOnDocument?: boolean
}

export interface UseDropzoneState {
    isDragActive: boolean
    isDragAccept: boolean
    isDragReject: boolean
}

export interface UseDropzoneReturn extends UseDropzoneState {
    getRootProps: () => {
        ref: React.RefObject<HTMLElement | null>
        onDragEnter: (e: DragEvent) => void
        onDragOver: (e: DragEvent) => void
        onDragLeave: (e: DragEvent) => void
        onDrop: (e: DragEvent) => void
        onClick: () => void
        onKeyDown: (e: React.KeyboardEvent) => void
        tabIndex: number
        role: string
    }
    getInputProps: () => {
        ref: React.RefObject<HTMLInputElement | null>
        type: 'file'
        style: React.CSSProperties
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
        multiple: boolean
        accept: string | undefined
        tabIndex: number
    }
    rootRef: React.RefObject<HTMLElement | null>
    inputRef: React.RefObject<HTMLInputElement | null>
    open: () => void
    acceptedFiles: File[]
    rejectedFiles: File[]
}

/**
 * Hook for creating a drag-and-drop file upload zone.
 * Provides file validation, drag state tracking, and accessibility features.
 *
 * @param options - Configuration options
 * @returns Dropzone state and prop getters
 *
 * @example
 * ```tsx
 * const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
 *   onDrop: (files) => console.log('Dropped:', files),
 *   accept: 'image/*',
 *   maxSize: 5242880, // 5MB
 * })
 *
 * return (
 *   <div {...getRootProps()}>
 *     <input {...getInputProps()} />
 *     {isDragActive ? (
 *       <p>Drop files here...</p>
 *     ) : (
 *       <p>Drag & drop files here, or click to select</p>
 *     )}
 *   </div>
 * )
 * ```
 */
export default function useDropzone(
    options: UseDropzoneOptions = {}
): UseDropzoneReturn {
    const {
        onDrop,
        onDropRejected,
        accept,
        maxSize = Infinity,
        minSize = 0,
        maxFiles = 0,
        multiple = true,
        disabled = false,
        noClick = false,
        noKeyboard = false,
        noDrag = false,
    } = options

    const rootRef = useRef<HTMLElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [isDragActive, setIsDragActive] = useState(false)
    const [isDragAccept, setIsDragAccept] = useState(false)
    const [isDragReject, setIsDragReject] = useState(false)
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
    const [rejectedFiles, setRejectedFiles] = useState<File[]>([])

    const dragTargetsRef = useRef<EventTarget[]>([])

    // Convert accept prop to array
    const acceptTypes = useMemo(
        () => (Array.isArray(accept) ? accept : accept ? [accept] : []),
        [accept]
    )

    // Check if file matches accept criteria
    const fileMatchesType = useCallback(
        (file: File): boolean => {
            if (acceptTypes.length === 0) return true

            const mimeType = file.type
            const baseMimeType = mimeType.replace(/\/.*$/, '')

            return acceptTypes.some((type) => {
                const validType = type.trim()

                // Exact match
                if (mimeType === validType) return true

                // Wildcard match (e.g., image/*)
                if (validType.endsWith('/*')) {
                    const baseValidType = validType.replace(/\/.*$/, '')
                    return baseMimeType === baseValidType
                }

                // Extension match (e.g., .jpg)
                if (validType.startsWith('.')) {
                    return file.name
                        .toLowerCase()
                        .endsWith(validType.toLowerCase())
                }

                return false
            })
        },
        [acceptTypes]
    )

    // Validate file
    const validateFile = useCallback(
        (file: File): boolean => {
            // Check file type
            if (!fileMatchesType(file)) {
                return false
            }

            // Check file size
            if (file.size < minSize || file.size > maxSize) {
                return false
            }

            return true
        },
        [fileMatchesType, minSize, maxSize]
    )

    // Process files
    const processFiles = useCallback(
        (files: FileList | File[]) => {
            const fileArray = Array.from(files)
            const accepted: File[] = []
            const rejected: File[] = []

            // Limit number of files
            const filesToProcess =
                maxFiles > 0 ? fileArray.slice(0, maxFiles) : fileArray

            filesToProcess.forEach((file) => {
                if (validateFile(file)) {
                    accepted.push(file)
                } else {
                    rejected.push(file)
                }
            })

            setAcceptedFiles(accepted)
            setRejectedFiles(rejected)

            if (accepted.length > 0 && onDrop) {
                onDrop(accepted)
            }

            if (rejected.length > 0 && onDropRejected) {
                onDropRejected(rejected)
            }
        },
        [maxFiles, validateFile, onDrop, onDropRejected]
    )

    // Check if drag contains valid files
    const isDragValid = useCallback((e: DragEvent): boolean => {
        if (!e.dataTransfer) return false

        const types = Array.from(e.dataTransfer.types)
        return types.includes('Files')
    }, [])

    // Handle drag enter
    const handleDragEnter = useCallback(
        (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()

            if (disabled || noDrag) return

            dragTargetsRef.current = [...dragTargetsRef.current, e.target]

            if (isDragValid(e)) {
                setIsDragActive(true)

                // Check if we can determine accept/reject state
                const items = e.dataTransfer?.items
                if (items && items.length > 0) {
                    const hasValidFile = Array.from(items).some((item) => {
                        if (item.kind === 'file') {
                            const file = item.getAsFile()
                            return file && validateFile(file)
                        }
                        return false
                    })

                    if (hasValidFile) {
                        setIsDragAccept(true)
                        setIsDragReject(false)
                    } else {
                        setIsDragAccept(false)
                        setIsDragReject(true)
                    }
                }
            }
        },
        [disabled, noDrag, isDragValid, validateFile]
    )

    // Handle drag over
    const handleDragOver = useCallback(
        (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()

            if (disabled || noDrag) return

            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy'
            }
        },
        [disabled, noDrag]
    )

    // Handle drag leave
    const handleDragLeave = useCallback(
        (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()

            if (disabled || noDrag) return

            const targets = dragTargetsRef.current.filter(
                (target) => target !== e.target
            )
            dragTargetsRef.current = targets

            if (targets.length === 0) {
                setIsDragActive(false)
                setIsDragAccept(false)
                setIsDragReject(false)
            }
        },
        [disabled, noDrag]
    )

    // Handle drop
    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()

            dragTargetsRef.current = []
            setIsDragActive(false)
            setIsDragAccept(false)
            setIsDragReject(false)

            if (disabled || noDrag) return

            const files = e.dataTransfer?.files
            if (files && files.length > 0) {
                processFiles(files)
            }
        },
        [disabled, noDrag, processFiles]
    )

    // Handle click to open file dialog
    const handleClick = useCallback(() => {
        if (disabled || noClick) return
        inputRef.current?.click()
    }, [disabled, noClick])

    // Handle keyboard activation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (disabled || noKeyboard) return

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputRef.current?.click()
            }
        },
        [disabled, noKeyboard]
    )

    // Handle input change
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (files && files.length > 0) {
                processFiles(files)
            }

            // Reset input value to allow selecting same file again
            e.target.value = ''
        },
        [processFiles]
    )

    // Open file dialog programmatically
    const open = useCallback(() => {
        if (!disabled) {
            inputRef.current?.click()
        }
    }, [disabled])

    // Get root props
    const getRootProps = useCallback(
        () => ({
            ref: rootRef,
            onDragEnter: handleDragEnter,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            tabIndex: disabled ? -1 : 0,
            role: 'button',
        }),
        [
            handleDragEnter,
            handleDragOver,
            handleDragLeave,
            handleDrop,
            handleClick,
            handleKeyDown,
            disabled,
        ]
    )

    // Get input props
    const getInputProps = useCallback(
        () => ({
            ref: inputRef,
            type: 'file' as const,
            style: { display: 'none' },
            onChange: handleInputChange,
            multiple: multiple && maxFiles !== 1,
            accept: acceptTypes.join(',') || undefined,
            tabIndex: -1,
        }),
        [handleInputChange, multiple, maxFiles, acceptTypes]
    )

    return {
        getRootProps,
        getInputProps,
        rootRef,
        inputRef,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        rejectedFiles,
        open,
    }
}
