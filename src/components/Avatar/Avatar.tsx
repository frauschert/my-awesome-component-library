import React, { useState, ImgHTMLAttributes } from 'react'
import { classNames } from '../../utility/classnames'
import './avatar.scss'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface AvatarProps {
    /** Image source URL */
    src?: string
    /** Alt text for the image */
    alt?: string
    /** Name to generate initials from (fallback when image fails/missing) */
    name?: string
    /** Size variant */
    size?: AvatarSize
    /** Status indicator */
    status?: AvatarStatus
    /** Custom initials (overrides generated from name) */
    initials?: string
    /** Whether the avatar is clickable */
    clickable?: boolean
    /** Click handler */
    onClick?: () => void
    /** Additional CSS class */
    className?: string
    /** Custom inline styles */
    style?: React.CSSProperties
    /** Additional img props */
    imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
}

const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = 'md',
    status,
    initials,
    clickable = false,
    onClick,
    className,
    style,
    imgProps,
}) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleImageError = () => {
        setImageError(true)
    }

    const handleImageLoad = () => {
        setImageLoaded(true)
    }

    const displayInitials = initials || (name ? getInitials(name) : undefined)
    const showImage = src && !imageError
    const showInitials = !showImage && displayInitials

    const avatarClasses = classNames(
        'avatar',
        `avatar--${size}`,
        {
            'avatar--clickable': clickable || onClick !== undefined,
            'avatar--with-status': !!status,
            'avatar--loaded': imageLoaded,
        },
        className
    )

    const handleClick = () => {
        if (onClick && (clickable || onClick)) {
            onClick()
        }
    }

    return (
        <div
            className={avatarClasses}
            style={style}
            onClick={handleClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onClick()
                          }
                      }
                    : undefined
            }
            aria-label={alt || name || 'Avatar'}
        >
            <div className="avatar__content">
                {showImage && (
                    <img
                        src={src}
                        alt={alt || name || 'Avatar'}
                        className="avatar__image"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        {...imgProps}
                    />
                )}
                {showInitials && (
                    <span className="avatar__initials">{displayInitials}</span>
                )}
                {!showImage && !showInitials && (
                    <svg
                        className="avatar__fallback-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                )}
            </div>
            {status && (
                <span
                    className={`avatar__status avatar__status--${status}`}
                    aria-label={status}
                />
            )}
        </div>
    )
}

export default Avatar
