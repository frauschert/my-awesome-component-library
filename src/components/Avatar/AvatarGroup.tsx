import React from 'react'
import { classNames } from '../../utility/classnames'
import Avatar, { AvatarSize } from './Avatar'
import './avatargroup.scss'

export interface AvatarGroupProps {
    /** Array of avatar configurations */
    avatars: Array<{
        src?: string
        alt?: string
        name?: string
        initials?: string
    }>
    /** Maximum number of avatars to display before showing overflow count */
    max?: number
    /** Size variant for all avatars */
    size?: AvatarSize
    /** Additional CSS class */
    className?: string
    /** Custom inline styles */
    style?: React.CSSProperties
    /** Callback when overflow count is clicked */
    onOverflowClick?: () => void
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
    avatars,
    max = 5,
    size = 'md',
    className,
    style,
    onOverflowClick,
}) => {
    const displayAvatars = avatars.slice(0, max)
    const overflowCount = Math.max(0, avatars.length - max)

    const groupClasses = classNames(
        'avatar-group',
        `avatar-group--${size}`,
        className
    )

    return (
        <div className={groupClasses} style={style}>
            {displayAvatars.map((avatar, index) => (
                <div key={index} className="avatar-group__item">
                    <Avatar size={size} {...avatar} />
                </div>
            ))}
            {overflowCount > 0 && (
                <div
                    className={classNames(
                        'avatar-group__item',
                        'avatar-group__overflow',
                        {
                            'avatar-group__overflow--clickable':
                                !!onOverflowClick,
                        }
                    )}
                    onClick={onOverflowClick}
                    role={onOverflowClick ? 'button' : undefined}
                    tabIndex={onOverflowClick ? 0 : undefined}
                    onKeyDown={
                        onOverflowClick
                            ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      onOverflowClick()
                                  }
                              }
                            : undefined
                    }
                    aria-label={`${overflowCount} more`}
                >
                    <div className="avatar-group__overflow-content">
                        <span className="avatar-group__overflow-text">
                            +{overflowCount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AvatarGroup
