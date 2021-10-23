import React from 'react'

import './skeleton.css'

export const SkeletonImage = () => {
    return (
        <div className="container shimmer skeletonImageWrapper">
            <div className="skeletonImageWrapper">
                <div className="skeletonImage" />
            </div>
        </div>
    )
}

export type SkeletonLineProps = {
    size: 'short' | 'medium' | 'large'
}
export const SkeletonLine = ({ size }: SkeletonLineProps) => {
    return <div className={`container shimmer skeletonline ${size}`} />
}
