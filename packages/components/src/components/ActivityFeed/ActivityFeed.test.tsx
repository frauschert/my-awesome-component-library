import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityFeed, { ActivityItem, ActivityType } from './ActivityFeed'

const mockActivities: ActivityItem[] = [
    {
        id: 1,
        type: 'comment',
        user: {
            name: 'John Doe',
            avatar: 'https://example.com/avatar1.jpg',
        },
        title: 'commented on your post',
        description: 'Great work!',
        timestamp: new Date('2024-01-01T10:00:00'),
        read: false,
    },
    {
        id: 2,
        type: 'like',
        user: {
            name: 'Jane Smith',
            avatar: 'https://example.com/avatar2.jpg',
        },
        title: 'liked your photo',
        timestamp: new Date('2024-01-01T09:00:00'),
        read: true,
    },
    {
        id: 3,
        type: 'follow',
        user: {
            name: 'Bob Wilson',
        },
        title: 'started following you',
        timestamp: new Date('2023-12-31T15:00:00'),
        read: true,
    },
]

describe('ActivityFeed', () => {
    describe('Rendering', () => {
        it('renders without crashing', () => {
            render(<ActivityFeed activities={mockActivities} />)
            expect(
                screen.getByText('commented on your post')
            ).toBeInTheDocument()
        })

        it('renders all activities', () => {
            render(<ActivityFeed activities={mockActivities} />)
            expect(
                screen.getByText('commented on your post')
            ).toBeInTheDocument()
            expect(screen.getByText('liked your photo')).toBeInTheDocument()
            expect(
                screen.getByText('started following you')
            ).toBeInTheDocument()
        })

        it('applies custom className', () => {
            const { container } = render(
                <ActivityFeed
                    activities={mockActivities}
                    className="custom-feed"
                />
            )
            expect(container.querySelector('.activity-feed')).toHaveClass(
                'custom-feed'
            )
        })

        it('applies custom styles', () => {
            const { container } = render(
                <ActivityFeed
                    activities={mockActivities}
                    style={{ backgroundColor: 'red' }}
                />
            )
            expect(container.querySelector('.activity-feed')).toHaveStyle({
                backgroundColor: 'red',
            })
        })

        it('forwards ref to the feed element', () => {
            const ref = React.createRef<HTMLDivElement>()
            render(<ActivityFeed activities={mockActivities} ref={ref} />)
            expect(ref.current).toBeInstanceOf(HTMLDivElement)
            expect(ref.current?.className).toContain('activity-feed')
        })
    })

    describe('Variants', () => {
        it('applies default variant class by default', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            expect(container.querySelector('.activity-feed')).toHaveClass(
                'activity-feed--default'
            )
        })

        it('applies compact variant class', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} variant="compact" />
            )
            expect(container.querySelector('.activity-feed')).toHaveClass(
                'activity-feed--compact'
            )
        })

        it('applies detailed variant class', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} variant="detailed" />
            )
            expect(container.querySelector('.activity-feed')).toHaveClass(
                'activity-feed--detailed'
            )
        })

        it('applies timeline variant class', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} variant="timeline" />
            )
            expect(container.querySelector('.activity-feed')).toHaveClass(
                'activity-feed--timeline'
            )
        })
    })

    describe('Activity Items', () => {
        it('displays user names', () => {
            render(<ActivityFeed activities={mockActivities} />)
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('Jane Smith')).toBeInTheDocument()
            expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
        })

        it('displays activity descriptions', () => {
            render(<ActivityFeed activities={mockActivities} />)
            expect(screen.getByText('Great work!')).toBeInTheDocument()
        })

        it('applies activity type classes', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            expect(
                container.querySelector('.activity-feed__item--comment')
            ).toBeInTheDocument()
            expect(
                container.querySelector('.activity-feed__item--like')
            ).toBeInTheDocument()
            expect(
                container.querySelector('.activity-feed__item--follow')
            ).toBeInTheDocument()
        })

        it('marks unread items with class', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            const unreadItems = container.querySelectorAll(
                '.activity-feed__item--unread'
            )
            expect(unreadItems).toHaveLength(1)
        })

        it('displays unread indicator for unread items', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            const indicators = container.querySelectorAll(
                '.activity-feed__unread-indicator'
            )
            expect(indicators).toHaveLength(1)
        })
    })

    describe('Avatars', () => {
        it('shows avatars by default', () => {
            render(<ActivityFeed activities={mockActivities} />)
            const avatars = screen.getAllByRole('img')
            expect(avatars).toHaveLength(2) // Only 2 have avatars
        })

        it('hides avatars when showAvatars is false', () => {
            render(
                <ActivityFeed activities={mockActivities} showAvatars={false} />
            )
            const avatars = screen.queryAllByRole('img')
            expect(avatars).toHaveLength(0)
        })

        it('renders avatar with correct src and alt', () => {
            render(<ActivityFeed activities={mockActivities} />)
            const avatar = screen.getByAltText('John Doe')
            expect(avatar).toHaveAttribute(
                'src',
                'https://example.com/avatar1.jpg'
            )
        })
    })

    describe('Icons', () => {
        it('shows icons by default', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            const icons = container.querySelectorAll('.activity-feed__icon')
            expect(icons).toHaveLength(3)
        })

        it('hides icons when showIcons is false', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} showIcons={false} />
            )
            const icons = container.querySelectorAll('.activity-feed__icon')
            expect(icons).toHaveLength(0)
        })

        it('uses custom icon renderer', () => {
            const iconRenderer = (type: ActivityType) => {
                return <span data-testid={`custom-icon-${type}`}>★</span>
            }
            render(
                <ActivityFeed
                    activities={mockActivities}
                    iconRenderer={iconRenderer}
                />
            )
            expect(
                screen.getByTestId('custom-icon-comment')
            ).toBeInTheDocument()
            expect(screen.getByTestId('custom-icon-like')).toBeInTheDocument()
            expect(screen.getByTestId('custom-icon-follow')).toBeInTheDocument()
        })

        it('uses activity custom icon when provided', () => {
            const activitiesWithIcons: ActivityItem[] = [
                {
                    ...mockActivities[0],
                    icon: <span data-testid="custom-activity-icon">🎉</span>,
                },
            ]
            render(<ActivityFeed activities={activitiesWithIcons} />)
            expect(
                screen.getByTestId('custom-activity-icon')
            ).toBeInTheDocument()
        })
    })

    describe('Timestamps', () => {
        it('shows timestamps by default', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            const timestamps = container.querySelectorAll(
                '.activity-feed__timestamp'
            )
            expect(timestamps).toHaveLength(3)
        })

        it('hides timestamps when showTimestamps is false', () => {
            const { container } = render(
                <ActivityFeed
                    activities={mockActivities}
                    showTimestamps={false}
                />
            )
            const timestamps = container.querySelectorAll(
                '.activity-feed__timestamp'
            )
            expect(timestamps).toHaveLength(0)
        })

        it('formats recent timestamps correctly', () => {
            const recentActivities: ActivityItem[] = [
                {
                    id: 1,
                    type: 'comment',
                    title: 'Test',
                    timestamp: new Date(Date.now() - 30000), // 30 seconds ago
                    read: true,
                },
            ]
            const { container } = render(
                <ActivityFeed activities={recentActivities} />
            )
            const timestamp = container.querySelector(
                '.activity-feed__timestamp'
            )
            expect(timestamp?.textContent).toBe('Just now')
        })
    })

    describe('Grouping', () => {
        it('does not group by date by default', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} />
            )
            expect(
                container.querySelector('.activity-feed__group')
            ).not.toBeInTheDocument()
        })

        it('groups activities by date when groupByDate is true', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} groupByDate />
            )
            const groups = container.querySelectorAll('.activity-feed__group')
            expect(groups.length).toBeGreaterThan(0)
        })

        it('displays group headers', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} groupByDate />
            )
            const headers = container.querySelectorAll(
                '.activity-feed__group-header'
            )
            expect(headers.length).toBeGreaterThan(0)
        })
    })

    describe('Filtering', () => {
        it('filters activities by type', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    filterTypes={['comment', 'like']}
                />
            )
            expect(
                screen.getByText('commented on your post')
            ).toBeInTheDocument()
            expect(screen.getByText('liked your photo')).toBeInTheDocument()
            expect(
                screen.queryByText('started following you')
            ).not.toBeInTheDocument()
        })

        it('shows only unread activities when showUnreadOnly is true', () => {
            render(<ActivityFeed activities={mockActivities} showUnreadOnly />)
            expect(
                screen.getByText('commented on your post')
            ).toBeInTheDocument()
            expect(
                screen.queryByText('liked your photo')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('started following you')
            ).not.toBeInTheDocument()
        })

        it('combines type filtering with unread filtering', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    filterTypes={['comment']}
                    showUnreadOnly
                />
            )
            expect(
                screen.getByText('commented on your post')
            ).toBeInTheDocument()
            expect(
                screen.queryByText('liked your photo')
            ).not.toBeInTheDocument()
        })
    })

    describe('Interactions', () => {
        it('calls onActivityClick when activity is clicked', () => {
            const handleClick = jest.fn()
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={handleClick}
                />
            )
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            fireEvent.click(firstItem!)
            expect(handleClick).toHaveBeenCalledWith(mockActivities[0])
        })

        it('calls onMarkAsRead when unread activity is clicked', () => {
            const handleMarkAsRead = jest.fn()
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={() => {}}
                    onMarkAsRead={handleMarkAsRead}
                />
            )
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            fireEvent.click(firstItem!)
            expect(handleMarkAsRead).toHaveBeenCalledWith(1)
        })

        it('does not call onMarkAsRead for already read activities', () => {
            const handleMarkAsRead = jest.fn()
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={() => {}}
                    onMarkAsRead={handleMarkAsRead}
                />
            )
            const secondItem = screen
                .getByText('liked your photo')
                .closest('.activity-feed__item')
            fireEvent.click(secondItem!)
            expect(handleMarkAsRead).not.toHaveBeenCalled()
        })

        it('handles keyboard interaction (Enter key)', () => {
            const handleClick = jest.fn()
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={handleClick}
                />
            )
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            fireEvent.keyDown(firstItem!, { key: 'Enter' })
            expect(handleClick).toHaveBeenCalledWith(mockActivities[0])
        })

        it('handles keyboard interaction (Space key)', () => {
            const handleClick = jest.fn()
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={handleClick}
                />
            )
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            fireEvent.keyDown(firstItem!, { key: ' ' })
            expect(handleClick).toHaveBeenCalledWith(mockActivities[0])
        })

        it('applies clickable class when onActivityClick is provided', () => {
            const { container } = render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={() => {}}
                />
            )
            const items = container.querySelectorAll(
                '.activity-feed__item--clickable'
            )
            expect(items).toHaveLength(3)
        })
    })

    describe('Load More', () => {
        it('does not show load more button by default', () => {
            render(<ActivityFeed activities={mockActivities} />)
            expect(screen.queryByText('Load More')).not.toBeInTheDocument()
        })

        it('shows load more button when showLoadMore is true', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    showLoadMore
                    onLoadMore={() => {}}
                />
            )
            expect(screen.getByText('Load More')).toBeInTheDocument()
        })

        it('calls onLoadMore when load more button is clicked', () => {
            const handleLoadMore = jest.fn()
            render(
                <ActivityFeed
                    activities={mockActivities}
                    showLoadMore
                    onLoadMore={handleLoadMore}
                />
            )
            fireEvent.click(screen.getByText('Load More'))
            expect(handleLoadMore).toHaveBeenCalledTimes(1)
        })

        it('shows loading state in load more button', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    showLoadMore
                    onLoadMore={() => {}}
                    loadingMore
                />
            )
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('disables load more button when loading', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    showLoadMore
                    onLoadMore={() => {}}
                    loadingMore
                />
            )
            const button = screen.getByText('Loading...').closest('button')
            expect(button).toBeDisabled()
        })
    })

    describe('Loading State', () => {
        it('shows loading spinner when loading is true', () => {
            const { container } = render(
                <ActivityFeed activities={[]} loading />
            )
            expect(
                container.querySelector('.activity-feed__loading')
            ).toBeInTheDocument()
            expect(
                screen.getByText('Loading activities...')
            ).toBeInTheDocument()
        })

        it('does not render activities when loading', () => {
            render(<ActivityFeed activities={mockActivities} loading />)
            expect(
                screen.queryByText('commented on your post')
            ).not.toBeInTheDocument()
        })
    })

    describe('Empty State', () => {
        it('shows empty message when no activities', () => {
            render(<ActivityFeed activities={[]} />)
            expect(
                screen.getByText('No activities to display')
            ).toBeInTheDocument()
        })

        it('shows custom empty message', () => {
            render(
                <ActivityFeed
                    activities={[]}
                    emptyMessage="Nothing here yet!"
                />
            )
            expect(screen.getByText('Nothing here yet!')).toBeInTheDocument()
        })

        it('shows empty state when all activities are filtered out', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    filterTypes={['error']}
                />
            )
            expect(
                screen.getByText('No activities to display')
            ).toBeInTheDocument()
        })
    })

    describe('Max Height', () => {
        it('applies maxHeight style when provided', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} maxHeight="400px" />
            )
            const feed = container.querySelector('.activity-feed')
            expect(feed).toHaveStyle({ maxHeight: '400px', overflowY: 'auto' })
        })

        it('applies maxHeight with number value', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} maxHeight={500} />
            )
            const feed = container.querySelector('.activity-feed')
            expect(feed).toHaveStyle({ maxHeight: '500px', overflowY: 'auto' })
        })
    })

    describe('Animation', () => {
        it('applies animation class to new items when animateNew is true', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} animateNew />
            )
            const animatedItems = container.querySelectorAll(
                '.activity-feed__item--animate-in'
            )
            expect(animatedItems.length).toBeGreaterThan(0)
        })

        it('does not apply animation class when animateNew is false', () => {
            const { container } = render(
                <ActivityFeed activities={mockActivities} animateNew={false} />
            )
            const animatedItems = container.querySelectorAll(
                '.activity-feed__item--animate-in'
            )
            expect(animatedItems).toHaveLength(0)
        })
    })

    describe('Accessibility', () => {
        it('applies role="button" to clickable items', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={() => {}}
                />
            )
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            expect(firstItem).toHaveAttribute('role', 'button')
        })

        it('applies tabIndex to clickable items', () => {
            render(
                <ActivityFeed
                    activities={mockActivities}
                    onActivityClick={() => {}}
                />
            )
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            expect(firstItem).toHaveAttribute('tabIndex', '0')
        })

        it('does not apply role or tabIndex to non-clickable items', () => {
            render(<ActivityFeed activities={mockActivities} />)
            const firstItem = screen
                .getByText('commented on your post')
                .closest('.activity-feed__item')
            expect(firstItem).not.toHaveAttribute('role')
            expect(firstItem).not.toHaveAttribute('tabIndex')
        })
    })
})
