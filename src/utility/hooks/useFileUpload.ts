import { BaseSyntheticEvent, useCallback, useRef, useState } from 'react'
import useEventListener from './useEventListener'

const overrideEventDefault = (ev: Event | BaseSyntheticEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
}

export default function useFileUpload() {
    const [dragging, setDragging] = useState(false)
    const [files, setFiles] = useState<FileList | null>(null)
    const [dragEventCounter, setDragEventCounter] = useState(0)

    const fileUploaderInputRef = useRef<HTMLInputElement | null>(null)

    useEventListener(window, 'dragover', overrideEventDefault)
    useEventListener(window, 'drop', overrideEventDefault)

    const onDragEnter = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            overrideEventDefault(event)

            setDragEventCounter((prev) => prev + 1)
            if (event.dataTransfer.items.length > 0) {
                setDragging(true)
            }
        },
        []
    )

    const onDragLeave = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            overrideEventDefault(event)

            setDragEventCounter(0)

            if (dragEventCounter === 0) {
                setDragging(false)
            }
        },
        [dragEventCounter]
    )

    const onDrop = useCallback((event: React.DragEvent<HTMLElement>) => {
        overrideEventDefault(event)
        setDragEventCounter(0)
        setDragging(false)

        if (event.dataTransfer.items.length > 0) {
            setFiles(event.dataTransfer.files)
        }
    }, [])

    const onSelectFileClick = useCallback(() => {
        fileUploaderInputRef.current?.click()
    }, [])

    const onFileChanged = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                setFiles(event.target.files)
            }
        },
        []
    )

    return {
        dragging,
        files,
        onDragEnter,
        onDragLeave,
        onDrop,
        onSelectFileClick,
        onFileChanged,
        fileUploaderInputRef,
    }
}
