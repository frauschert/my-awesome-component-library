import React, { BaseSyntheticEvent } from 'react'

import useFileUpload from '../../utility/hooks/useFileUpload'
import FileUpload from './FileUpload'

import './fileupload.css'

const overrideEventDefault = (ev: Event | BaseSyntheticEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
}

const FileUploader = () => {
    const {
        dragging,
        files,
        onDragEnter,
        onDragLeave,
        onDrop,
        fileUploaderInputRef,
        onFileChanged,
        onSelectFileClick,
    } = useFileUpload()

    return (
        <FileUpload
            dragging={dragging}
            files={files}
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
