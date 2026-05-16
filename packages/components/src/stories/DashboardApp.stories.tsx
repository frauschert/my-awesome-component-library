import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

// Import components
import Container from '../components/Container'
import NavBar from '../components/NavBar'
import type { NavBarItem } from '../components/NavBar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import DataGrid from '../components/DataGrid'
import type { DataGridColumn } from '../components/DataGrid'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Tabs from '../components/Tabs'
import type { TabItem } from '../components/Tabs'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import ProgressBar from '../components/ProgressBar'
import Rating from '../components/Rating'
import Switch from '../components/Switch'
import Checkbox from '../components/Checkbox'
import Typography from '../components/Typography'
import Stack from '../components/Stack'
import Grid from '../components/Grid'
import Divider from '../components/Divider'
import Tooltip from '../components/Tooltip'
import Breadcrumb from '../components/Breadcrumb'
import Chip from '../components/Chip'
import ActivityFeed from '../components/ActivityFeed'
import type { ActivityItem } from '../components/ActivityFeed'
import Timeline from '../components/Timeline'
import type { TimelineItemProps } from '../components/Timeline'
import FloatingActionButton from '../components/FloatingActionButton'

const DashboardApp = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    // Sample data
    const userData = {
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        role: 'Product Manager',
        avatar: 'https://i.pravatar.cc/150?img=1',
    }

    const navItems: NavBarItem[] = [
        { id: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: '📊' },
        { id: 'team', label: 'Team', href: '#team', icon: '👥' },
        { id: 'projects', label: 'Projects', href: '#projects', icon: '📁' },
        { id: 'settings', label: 'Settings', href: '#settings', icon: '⚙️' },
    ]

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'reports', label: 'Reports', icon: '📄' },
        { id: 'team', label: 'Team', icon: '👥' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
        { id: 'help', label: 'Help', icon: '❓' },
    ]

    // Project data for DataGrid
    type Project = {
        id: number
        name: string
        status: string
        progress: number
        team: string
        dueDate: string
        priority: string
    }

    const projects: Project[] = [
        {
            id: 1,
            name: 'Website Redesign',
            status: 'In Progress',
            progress: 75,
            team: 'Design',
            dueDate: '2024-02-15',
            priority: 'High',
        },
        {
            id: 2,
            name: 'Mobile App v2.0',
            status: 'Planning',
            progress: 25,
            team: 'Engineering',
            dueDate: '2024-03-01',
            priority: 'High',
        },
        {
            id: 3,
            name: 'Marketing Campaign',
            status: 'Completed',
            progress: 100,
            team: 'Marketing',
            dueDate: '2024-01-20',
            priority: 'Medium',
        },
        {
            id: 4,
            name: 'API Integration',
            status: 'In Progress',
            progress: 60,
            team: 'Engineering',
            dueDate: '2024-02-28',
            priority: 'High',
        },
        {
            id: 5,
            name: 'User Research',
            status: 'In Progress',
            progress: 40,
            team: 'Research',
            dueDate: '2024-02-10',
            priority: 'Medium',
        },
    ]

    // DataGrid columns with proper type
    const columns: DataGridColumn<Project>[] = [
        {
            id: 'name',
            header: 'Project Name',
            accessor: 'name',
        },
        {
            id: 'status',
            header: 'Status',
            accessor: 'status',
            cell: (value) => {
                const statusValue = String(value)
                const variant =
                    statusValue === 'Completed'
                        ? 'success'
                        : statusValue === 'In Progress'
                        ? 'primary'
                        : 'info'
                return <Badge variant={variant}>{statusValue}</Badge>
            },
        },
        {
            id: 'progress',
            header: 'Progress',
            accessor: 'progress',
            cell: (value) => {
                const progressValue = Number(value)
                const color =
                    progressValue === 100
                        ? 'success'
                        : progressValue >= 50
                        ? 'primary'
                        : 'warning'
                return (
                    <ProgressBar
                        value={progressValue}
                        size="small"
                        color={color}
                    />
                )
            },
        },
        {
            id: 'team',
            header: 'Team',
            accessor: 'team',
        },
        {
            id: 'dueDate',
            header: 'Due Date',
            accessor: 'dueDate',
        },
        {
            id: 'priority',
            header: 'Priority',
            accessor: 'priority',
            cell: (value) => {
                const priorityValue = String(value)
                return (
                    <Chip
                        label={priorityValue}
                        variant="filled"
                        color={priorityValue === 'High' ? 'danger' : 'info'}
                    />
                )
            },
        },
    ]

    // Activity feed data
    const activityItems: ActivityItem[] = [
        {
            id: '1',
            type: 'comment',
            user: {
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/150?img=2',
            },
            title: 'Commented on Website Redesign',
            description: 'Looks great! Love the new color scheme.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
            id: '2',
            type: 'update',
            user: {
                name: 'Jane Smith',
                avatar: 'https://i.pravatar.cc/150?img=3',
            },
            title: 'Updated Mobile App v2.0',
            description: 'Changed status to Planning',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
            id: '3',
            type: 'create',
            user: {
                name: 'Mike Wilson',
                avatar: 'https://i.pravatar.cc/150?img=4',
            },
            title: 'Created new task in User Research',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
        },
    ]

    // Timeline data
    const timelineItems: TimelineItemProps[] = [
        {
            title: 'Project Kickoff',
            description: 'Initial planning and team assignment',
            timestamp: '2024-01-01',
            status: 'success',
        },
        {
            title: 'Design Phase',
            description: 'UI/UX design and prototyping',
            timestamp: '2024-01-15',
            status: 'success',
        },
        {
            title: 'Development',
            description: 'Frontend and backend implementation',
            timestamp: '2024-02-01',
            status: 'info',
        },
        {
            title: 'Testing & QA',
            description: 'Quality assurance and bug fixes',
            timestamp: '2024-02-20',
            status: 'warning',
        },
        {
            title: 'Launch',
            description: 'Production deployment',
            timestamp: '2024-03-01',
            status: 'default',
        },
    ]

    // Tab items with content
    const tabItems: TabItem[] = [
        {
            id: 'overview',
            label: 'Overview',
            content: (
                <div style={{ padding: '20px' }}>
                    <Typography variant="h3" style={{ marginBottom: '16px' }}>
                        Project Overview
                    </Typography>
                    <Alert variant="info" style={{ marginBottom: '16px' }}>
                        Welcome to your dashboard! Here's a quick overview of
                        your projects and activities.
                    </Alert>
                    <DataGrid data={projects} columns={columns} />
                </div>
            ),
        },
        {
            id: 'projects',
            label: 'Projects',
            content: (
                <div style={{ padding: '20px' }}>
                    <Stack direction="vertical" gap="md">
                        <Typography variant="h3">Active Projects</Typography>
                        <Stack
                            direction="horizontal"
                            gap="sm"
                            style={{ flexWrap: 'wrap' as const }}
                        >
                            <Chip variant="filled" label="Frontend" />
                            <Chip variant="filled" label="Backend" />
                            <Chip variant="filled" label="Design" />
                            <Chip variant="outlined" label="Urgent" />
                            <Chip variant="outlined" label="Review" />
                        </Stack>
                        <DataGrid data={projects} columns={columns} />
                    </Stack>
                </div>
            ),
        },
        {
            id: 'activity',
            label: 'Team Activity',
            content: (
                <div style={{ padding: '20px' }}>
                    <Typography variant="h3" style={{ marginBottom: '16px' }}>
                        Recent Activity
                    </Typography>
                    <ActivityFeed activities={activityItems} />
                </div>
            ),
        },
        {
            id: 'timeline',
            label: 'Timeline',
            content: (
                <div style={{ padding: '20px' }}>
                    <Typography variant="h3" style={{ marginBottom: '16px' }}>
                        Project Timeline
                    </Typography>
                    <Timeline items={timelineItems} variant="default" />
                </div>
            ),
        },
    ]

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Top Navigation */}
            <NavBar
                items={navItems}
                variant="elevated"
                position="sticky"
                actions={
                    <Stack direction="horizontal" align="center" gap="md">
                        {/* Theme Switcher */}
                        <Tooltip content="Toggle dark mode">
                            <Switch
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                            />
                        </Tooltip>

                        {/* Notifications */}
                        <Tooltip content="Notifications">
                            <div style={{ position: 'relative' }}>
                                <Button variant="link">🔔</Button>
                                <Badge variant="danger">3</Badge>
                            </div>
                        </Tooltip>

                        {/* User Profile */}
                        <Avatar
                            size="sm"
                            src={userData.avatar}
                            alt={userData.name}
                        />
                    </Stack>
                }
            />

            {/* Main Layout */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <Sidebar
                    variant="floating"
                    collapsed={!sidebarOpen}
                    onCollapsedChange={(collapsed) =>
                        setSidebarOpen(!collapsed)
                    }
                    items={sidebarItems}
                    width="normal"
                />

                {/* Main Content */}
                <div style={{ paddingTop: '24px' }}>
                    <Container center as="main">
                        {/* Breadcrumb */}
                        <div style={{ marginBottom: '24px' }}>
                            <Breadcrumb
                                items={[
                                    { label: 'Home', href: '#' },
                                    { label: 'Dashboard', href: '#dashboard' },
                                    { label: 'Overview' },
                                ]}
                            />
                        </div>

                        {/* Page Header */}
                        <Stack
                            direction="horizontal"
                            justify="space-between"
                            align="center"
                            style={{ margin: '24px 0' }}
                        >
                            <div>
                                <Typography variant="h1">Dashboard</Typography>
                                <Typography
                                    variant="body2"
                                    style={{ color: 'var(--theme-text-muted)' }}
                                >
                                    Welcome back, {userData.name}
                                </Typography>
                            </div>
                            <Stack direction="horizontal" gap="sm">
                                <Button variant="secondary">Export</Button>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowModal(true)}
                                >
                                    + New Project
                                </Button>
                            </Stack>
                        </Stack>

                        {/* Stats Grid */}
                        <div style={{ marginBottom: '24px' }}>
                            <Grid columns={4} gap="md">
                                <Card variant="elevated">
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: 'var(--theme-text-muted)',
                                        }}
                                    >
                                        Total Projects
                                    </Typography>
                                    <Typography variant="h2">24</Typography>
                                    <ProgressBar
                                        value={85}
                                        color="primary"
                                        size="small"
                                    />
                                </Card>
                                <Card variant="elevated">
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: 'var(--theme-text-muted)',
                                        }}
                                    >
                                        Completed
                                    </Typography>
                                    <Typography variant="h2">18</Typography>
                                    <ProgressBar
                                        value={92}
                                        color="success"
                                        size="small"
                                    />
                                </Card>
                                <Card variant="elevated">
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: 'var(--theme-text-muted)',
                                        }}
                                    >
                                        In Progress
                                    </Typography>
                                    <Typography variant="h2">5</Typography>
                                    <ProgressBar
                                        value={78}
                                        color="info"
                                        size="small"
                                    />
                                </Card>
                                <Card variant="elevated">
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: 'var(--theme-text-muted)',
                                        }}
                                    >
                                        Team Members
                                    </Typography>
                                    <Typography variant="h2">12</Typography>
                                    <Stack
                                        direction="horizontal"
                                        align="center"
                                        gap="sm"
                                    >
                                        <Avatar
                                            size="xs"
                                            src="https://i.pravatar.cc/150?img=5"
                                        />
                                        <Avatar
                                            size="xs"
                                            src="https://i.pravatar.cc/150?img=6"
                                        />
                                        <Avatar
                                            size="xs"
                                            src="https://i.pravatar.cc/150?img=7"
                                        />
                                        <Typography variant="caption">
                                            +9
                                        </Typography>
                                    </Stack>
                                </Card>
                            </Grid>
                        </div>

                        <div style={{ margin: '24px 0' }}>
                            <Divider />
                        </div>

                        {/* Main Content Tabs */}
                        <Tabs
                            variant="line"
                            items={tabItems}
                            defaultActiveId="overview"
                        />

                        <div style={{ margin: '24px 0' }}>
                            <Divider />
                        </div>

                        {/* Bottom Section with Metrics */}
                        <Grid columns={2} gap="lg">
                            <Card variant="elevated">
                                <Typography
                                    variant="h3"
                                    style={{ marginBottom: '16px' }}
                                >
                                    Performance Metrics
                                </Typography>
                                <Stack direction="vertical" gap="md">
                                    <div>
                                        <Typography variant="body2">
                                            Code Quality
                                        </Typography>
                                        <ProgressBar
                                            value={85}
                                            color="primary"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body2">
                                            Test Coverage
                                        </Typography>
                                        <ProgressBar
                                            value={92}
                                            color="success"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="body2">
                                            Performance Score
                                        </Typography>
                                        <ProgressBar value={78} color="info" />
                                    </div>
                                </Stack>
                            </Card>
                            <Card variant="elevated">
                                <Typography
                                    variant="h3"
                                    style={{ marginBottom: '16px' }}
                                >
                                    Quick Actions
                                </Typography>
                                <Stack direction="vertical" gap="sm">
                                    <Stack
                                        direction="horizontal"
                                        align="center"
                                        gap="sm"
                                    >
                                        <Checkbox />{' '}
                                        <Typography>
                                            Enable notifications
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="horizontal"
                                        align="center"
                                        gap="sm"
                                    >
                                        <Checkbox />{' '}
                                        <Typography>
                                            Auto-save changes
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="horizontal"
                                        align="center"
                                        gap="sm"
                                    >
                                        <Checkbox />{' '}
                                        <Typography>
                                            Show activity feed
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <div>
                                        <Typography
                                            variant="body2"
                                            style={{ marginBottom: '8px' }}
                                        >
                                            Team Satisfaction
                                        </Typography>
                                        <Stack
                                            direction="horizontal"
                                            align="center"
                                            gap="sm"
                                        >
                                            <Rating
                                                value={4.5}
                                                precision="half"
                                                readOnly
                                                size="medium"
                                            />
                                            <Typography variant="caption">
                                                4.5/5
                                            </Typography>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Card>
                        </Grid>
                    </Container>
                </div>
            </div>

            {/* Modal for New Project */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Project"
                size="md"
            >
                <Stack direction="vertical" gap="md">
                    <Input
                        type="text"
                        label="Project Name"
                        placeholder="Enter project name"
                    />
                    <Select
                        label="Team"
                        placeholder="Select team"
                        options={[
                            { value: 'design', label: 'Design' },
                            { value: 'engineering', label: 'Engineering' },
                            { value: 'marketing', label: 'Marketing' },
                        ]}
                    />
                    <Select
                        label="Priority"
                        placeholder="Select priority"
                        options={[
                            { value: 'high', label: 'High' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'low', label: 'Low' },
                        ]}
                    />
                    <Input
                        type="text"
                        label="Due Date"
                        placeholder="YYYY-MM-DD"
                    />
                    <Stack direction="horizontal" justify="end" gap="sm">
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowModal(false)
                            }}
                        >
                            Create Project
                        </Button>
                    </Stack>
                </Stack>
            </Modal>

            {/* Floating Action Button */}
            <FloatingActionButton
                icon="+"
                aria-label="Quick actions"
                position="bottom-right"
                variant="primary"
                onClick={() => setShowModal(true)}
            />
        </div>
    )
}

const meta: Meta<typeof DashboardApp> = {
    title: 'Examples/Dashboard Application',
    component: DashboardApp,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A comprehensive dashboard application showcasing the integration of 30+ components from the library in a realistic business scenario. This example demonstrates: navigation with NavBar and Sidebar, data visualization with DataGrid and ProgressBar, user interactions with Modals and Buttons, content organization with Tabs and Cards, activity tracking with ActivityFeed and Timeline, and much more.',
            },
        },
    },
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DashboardApp>

export const Default: Story = {}
