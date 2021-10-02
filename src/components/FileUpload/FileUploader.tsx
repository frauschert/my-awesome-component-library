import React, { useState, useRef, useEffect, BaseSyntheticEvent } from 'react'
import FileUpload from './FileUpload'
import './fileupload.css'

const overrideEventDefault = (ev: Event | BaseSyntheticEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
}

const FileUploader = () => {
    const [dragging, setDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [dragEventCounter, setDragEventCounter] = useState(0)

    const fileUploaderInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        window.addEventListener('dragover', overrideEventDefault)
        window.addEventListener('drop', overrideEventDefault)

        return () => {
            window.removeEventListener('dragover', overrideEventDefault)
            window.removeEventListener('drop', overrideEventDefault)
        }
    })

    const onSelectFileClick = () => {
        fileUploaderInputRef.current?.click()
    }

    const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        overrideEventDefault(event)

        setDragEventCounter(dragEventCounter + 1)
        if (event.dataTransfer.items.length > 0) {
            setDragging(true)
        }
    }

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        overrideEventDefault(event)

        setDragEventCounter(0)

        if (dragEventCounter === 0) {
            setDragging(false)
        }
    }

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        overrideEventDefault(event)
        setDragEventCounter(0)
        setDragging(false)

        if (event.dataTransfer.items.length > 0) {
            setFile(event.dataTransfer.files[0])
        }
    }

    const onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }

    return (
        <FileUpload
            dragging={dragging}
            file={file}
            onSelectFileClick={onSelectFileClick}
            onDrag={overrideEventDefault}
            onDragStart={overrideEventDefault}
            onDragEnd={overrideEventDefault}
            onDragOver={overrideEventDefault}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <input
                ref={fileUploaderInputRef}
                type="file"
                className="file-uploader__input"
                onChange={onFileChanged}
            />
        </FileUpload>
    )
}

export default FileUploader
