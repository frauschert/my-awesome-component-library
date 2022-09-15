import React, { PropsWithChildren } from 'react'
import './fileupload.css'

export type FileUploadProps = {
    dragging: boolean
    files: FileList | null
    onSelectFileClick: () => void
    onDrag: (event: React.DragEvent<HTMLDivElement>) => void
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
    onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void
    onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void
    onDrop: (event: React.DragEvent<HTMLElement>) => void
}

const FileUpload = (props: PropsWithChildren<FileUploadProps>) => {
    const {
        dragging,
        files,
        onSelectFileClick,
        onDrag,
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDrop,
    } = props

    let uploaderClasses = 'file-uploader'
    if (dragging) {
        uploaderClasses += ' file-uploader--dragging'
    }

    const fileNames = files
        ? [...files].map((file) => file.name)
        : ['No File Uploaded!']

    return (
        <div
            className={uploaderClasses}
            onDrag={onDrag}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="file-uploader__contents">
                {fileNames.map((fileName) => (
                    <span key={fileName} className="file-uploader__file-name">
                        {fileName}
                    </span>
                ))}
                <span>Drag & Drop File</span>
                <span>or</span>
                <span onClick={onSelectFileClick}>Select File</span>
            </div>
            {props.children}
        </div>
    )
}

export default FileUpload
