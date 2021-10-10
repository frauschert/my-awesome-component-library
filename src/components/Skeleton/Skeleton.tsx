import React from 'react'

import './skeleton.css'

const Skeleton = () => {
    return (
        <div className="placeholder shimmer">
            <div className="faux-image-wrapper">
                <div className="faux-image" />
            </div>
            <div className="faux-text" />
            <div className="faux-text short" />
        </div>
    )
}

export default Skeleton
