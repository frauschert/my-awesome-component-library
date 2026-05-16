import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Avatar from './Avatar'
import AvatarGroup from './AvatarGroup'

describe('Avatar', () => {
    describe('Image rendering', () => {
        it('should render with image source', () => {
            render(
                <Avatar
                    src="https://example.com/avatar.jpg"
                    alt="User avatar"
                />
            )
            const img = screen.getByRole('img', { name: 'User avatar' })
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
        })

        it('should render initials when no image provided', () => {
            render(<Avatar name="John Doe" />)
            expect(screen.getByText('JD')).toBeInTheDocument()
        })

        it('should render custom initials', () => {
            render(<Avatar name="John Doe" initials="AB" />)
            expect(screen.getByText('AB')).toBeInTheDocument()
        })

        it('should render fallback icon when no image or name', () => {
            const { container } = render(<Avatar />)
            expect(
                container.querySelector('.avatar__fallback-icon')
            ).toBeInTheDocument()
        })

        it('should show initials on image error', () => {
            render(<Avatar src="invalid.jpg" name="Jane Smith" />)
            const img = screen.getByRole('img')
            fireEvent.error(img)
            expect(screen.getByText('JS')).toBeInTheDocument()
        })
    })

    describe('Initials generation', () => {
        it('should generate initials from single name', () => {
            render(<Avatar name="Madonna" />)
            expect(screen.getByText('MA')).toBeInTheDocument()
        })

        it('should generate initials from first and last name', () => {
            render(<Avatar name="John Doe" />)
            expect(screen.getByText('JD')).toBeInTheDocument()
        })

        it('should generate initials from multiple names', () => {
            render(<Avatar name="John Michael Doe" />)
            expect(screen.getByText('JD')).toBeInTheDocument()
        })

        it('should uppercase initials', () => {
            render(<Avatar name="alice bob" />)
            expect(screen.getByText('AB')).toBeInTheDocument()
        })
    })

    describe('Sizes', () => {
        it('should apply xs size class', () => {
            const { container } = render(<Avatar name="Test" size="xs" />)
            expect(container.querySelector('.avatar--xs')).toBeInTheDocument()
        })

        it('should apply md size by default', () => {
            const { container } = render(<Avatar name="Test" />)
            expect(container.querySelector('.avatar--md')).toBeInTheDocument()
        })

        it('should apply xl size class', () => {
            const { container } = render(<Avatar name="Test" size="xl" />)
            expect(container.querySelector('.avatar--xl')).toBeInTheDocument()
        })
    })

    describe('Status indicator', () => {
        it('should render online status', () => {
            const { container } = render(<Avatar name="Test" status="online" />)
            expect(
                container.querySelector('.avatar__status--online')
            ).toBeInTheDocument()
        })

        it('should render busy status', () => {
            const { container } = render(<Avatar name="Test" status="busy" />)
            expect(
                container.querySelector('.avatar__status--busy')
            ).toBeInTheDocument()
        })

        it('should add with-status class', () => {
            const { container } = render(<Avatar name="Test" status="online" />)
            expect(
                container.querySelector('.avatar--with-status')
            ).toBeInTheDocument()
        })
    })

    describe('Interaction', () => {
        it('should call onClick when clicked', () => {
            const handleClick = jest.fn()
            render(<Avatar name="Test" onClick={handleClick} />)
            fireEvent.click(screen.getByRole('button'))
            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should call onClick on Enter key', () => {
            const handleClick = jest.fn()
            render(<Avatar name="Test" onClick={handleClick} />)
            const avatar = screen.getByRole('button')
            fireEvent.keyDown(avatar, { key: 'Enter' })
            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should call onClick on Space key', () => {
            const handleClick = jest.fn()
            render(<Avatar name="Test" onClick={handleClick} />)
            const avatar = screen.getByRole('button')
            fireEvent.keyDown(avatar, { key: ' ' })
            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should apply clickable class when onClick provided', () => {
            const { container } = render(
                <Avatar name="Test" onClick={() => {}} />
            )
            expect(
                container.querySelector('.avatar--clickable')
            ).toBeInTheDocument()
        })

        it('should have correct ARIA attributes when clickable', () => {
            render(<Avatar name="Test User" onClick={() => {}} />)
            const avatar = screen.getByRole('button')
            expect(avatar).toHaveAttribute('aria-label', 'Test User')
            expect(avatar).toHaveAttribute('tabIndex', '0')
        })
    })

    describe('Custom props', () => {
        it('should apply custom className', () => {
            const { container } = render(
                <Avatar name="Test" className="custom-class" />
            )
            expect(container.querySelector('.custom-class')).toBeInTheDocument()
        })

        it('should apply custom styles', () => {
            const { container } = render(
                <Avatar name="Test" style={{ backgroundColor: 'red' }} />
            )
            const avatar = container.querySelector('.avatar')
            expect(avatar).toHaveStyle({ backgroundColor: 'red' })
        })
    })
})

describe('AvatarGroup', () => {
    const mockAvatars = [
        { name: 'Alice Johnson', src: 'https://example.com/alice.jpg' },
        { name: 'Bob Smith' },
        { name: 'Charlie Brown' },
        { name: 'Diana Prince' },
        { name: 'Eve Williams' },
        { name: 'Frank Miller' },
        { name: 'Grace Hopper' },
    ]

    it('should render all avatars when count is below max', () => {
        const { container } = render(
            <AvatarGroup avatars={mockAvatars.slice(0, 3)} max={5} />
        )
        expect(container.querySelectorAll('.avatar-group__item')).toHaveLength(
            3
        )
    })

    it('should render max avatars and overflow count', () => {
        const { container } = render(
            <AvatarGroup avatars={mockAvatars} max={4} />
        )
        expect(container.querySelectorAll('.avatar-group__item')).toHaveLength(
            5
        ) // 4 avatars + 1 overflow
        expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('should render correct overflow count', () => {
        render(<AvatarGroup avatars={mockAvatars} max={3} />)
        expect(screen.getByText('+4')).toBeInTheDocument()
    })

    it('should not render overflow when all avatars fit', () => {
        const { container } = render(
            <AvatarGroup avatars={mockAvatars.slice(0, 3)} max={5} />
        )
        expect(
            container.querySelector('.avatar-group__overflow')
        ).not.toBeInTheDocument()
    })

    it('should apply size to all avatars', () => {
        const { container } = render(
            <AvatarGroup avatars={mockAvatars.slice(0, 2)} size="lg" />
        )
        expect(container.querySelector('.avatar-group--lg')).toBeInTheDocument()
        expect(container.querySelectorAll('.avatar--lg')).toHaveLength(2)
    })

    it('should call onOverflowClick when overflow is clicked', () => {
        const handleClick = jest.fn()
        render(
            <AvatarGroup
                avatars={mockAvatars}
                max={3}
                onOverflowClick={handleClick}
            />
        )
        fireEvent.click(screen.getByRole('button', { name: /more/i }))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle keyboard interaction on overflow', () => {
        const handleClick = jest.fn()
        render(
            <AvatarGroup
                avatars={mockAvatars}
                max={3}
                onOverflowClick={handleClick}
            />
        )
        const overflow = screen.getByRole('button', { name: /more/i })
        fireEvent.keyDown(overflow, { key: 'Enter' })
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should apply custom className', () => {
        const { container } = render(
            <AvatarGroup
                avatars={mockAvatars.slice(0, 2)}
                className="custom-group"
            />
        )
        expect(container.querySelector('.custom-group')).toBeInTheDocument()
    })

    it('should have avatar-group class with proper styling', () => {
        const { container } = render(
            <AvatarGroup avatars={mockAvatars.slice(0, 3)} />
        )
        const group = container.querySelector('.avatar-group')
        expect(group).toBeInTheDocument()
        expect(group).toHaveClass('avatar-group')
    })
})
