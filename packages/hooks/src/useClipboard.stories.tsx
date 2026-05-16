import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import useClipboard from './useClipboard'
import Button from '../../components/Button'

const meta: Meta = {
    title: 'Hooks/useClipboard',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const BasicCopyDemo = () => {
    const { copy, text, copied, isSupported } = useClipboard()

    return (
        <div style={{ padding: '20px' }}>
            <h3>Basic Copy</h3>
            {!isSupported && (
                <div
                    style={{
                        padding: '10px',
                        background: '#fee',
                        borderRadius: '4px',
                        marginBottom: '20px',
                    }}
                >
                    ⚠️ Clipboard API not supported in this environment
                </div>
            )}
            <div style={{ marginBottom: '20px' }}>
                <Button onClick={() => copy('Hello from clipboard!')}>
                    Copy Text
                </Button>
                <Button
                    onClick={() => copy('https://example.com')}
                    style={{ marginLeft: '10px' }}
                >
                    Copy URL
                </Button>
                <Button
                    onClick={() => copy('console.log("Hello World")')}
                    style={{ marginLeft: '10px' }}
                >
                    Copy Code
                </Button>
            </div>
            <div>
                <strong>Copied:</strong> {copied ? '✅' : '❌'}
            </div>
            <div style={{ marginTop: '10px' }}>
                <strong>Last text:</strong>{' '}
                <code
                    style={{
                        background: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '3px',
                    }}
                >
                    {text || 'None'}
                </code>
            </div>
        </div>
    )
}

export const BasicCopy: Story = {
    render: () => <BasicCopyDemo />,
}

const ReadClipboardDemo = () => {
    const { read, text, error, isSupported } = useClipboard()

    return (
        <div style={{ padding: '20px' }}>
            <h3>Read Clipboard</h3>
            {!isSupported && (
                <div
                    style={{
                        padding: '10px',
                        background: '#fee',
                        borderRadius: '4px',
                        marginBottom: '20px',
                    }}
                >
                    ⚠️ Clipboard API not supported in this environment
                </div>
            )}
            <p>
                First copy some text to your clipboard, then click &quot;Read
                Clipboard&quot;.
            </p>
            <Button onClick={read}>Read Clipboard</Button>
            <div style={{ marginTop: '20px' }}>
                <strong>Clipboard content:</strong>
                <div
                    style={{
                        marginTop: '10px',
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        minHeight: '60px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}
                >
                    {text || '(empty)'}
                </div>
            </div>
            {error && (
                <div
                    style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: '#fee',
                        borderRadius: '4px',
                        color: '#c00',
                    }}
                >
                    Error: {error.message}
                </div>
            )}
        </div>
    )
}

export const ReadClipboard: Story = {
    render: () => <ReadClipboardDemo />,
}

const CopyWithCallbacksDemo = () => {
    const [notifications, setNotifications] = useState<string[]>([])

    const { copy, text, copied } = useClipboard({
        successDuration: 3000,
        onSuccess: (copiedText) => {
            setNotifications((prev) => [
                ...prev,
                `✅ Successfully copied: "${copiedText.slice(0, 30)}${
                    copiedText.length > 30 ? '...' : ''
                }"`,
            ])
        },
        onError: (err) => {
            setNotifications((prev) => [...prev, `❌ Error: ${err.message}`])
        },
    })

    return (
        <div style={{ padding: '20px' }}>
            <h3>Copy with Callbacks</h3>
            <p>Success duration: 3 seconds</p>
            <div style={{ marginBottom: '20px' }}>
                <Button onClick={() => copy('Short text')}>Copy Short</Button>
                <Button
                    onClick={() =>
                        copy(
                            'This is a very long text that will be truncated in the notification message to keep things readable'
                        )
                    }
                    style={{ marginLeft: '10px' }}
                >
                    Copy Long
                </Button>
                <Button
                    onClick={() => copy('Multi\nLine\nText')}
                    style={{ marginLeft: '10px' }}
                >
                    Copy Multi-line
                </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <strong>Status:</strong>{' '}
                <span
                    style={{
                        color: copied ? '#0a0' : '#999',
                        fontWeight: 'bold',
                    }}
                >
                    {copied ? 'COPIED' : 'Ready'}
                </span>
            </div>
            <div>
                <strong>Current clipboard:</strong>{' '}
                <code
                    style={{
                        background: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '3px',
                    }}
                >
                    {text || 'None'}
                </code>
            </div>
            <div style={{ marginTop: '20px' }}>
                <strong>Notifications:</strong>
                <div
                    style={{
                        marginTop: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                >
                    {notifications.length === 0 ? (
                        <div style={{ padding: '10px', color: '#999' }}>
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notif, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '8px 12px',
                                    borderBottom:
                                        i < notifications.length - 1
                                            ? '1px solid #eee'
                                            : 'none',
                                }}
                            >
                                {notif}
                            </div>
                        ))
                    )}
                </div>
                {notifications.length > 0 && (
                    <Button
                        onClick={() => setNotifications([])}
                        style={{ marginTop: '10px' }}
                    >
                        Clear Notifications
                    </Button>
                )}
            </div>
        </div>
    )
}

export const CopyWithCallbacks: Story = {
    render: () => <CopyWithCallbacksDemo />,
}

const ClipboardManagerDemo = () => {
    const [history, setHistory] = useState<string[]>([])
    const [inputValue, setInputValue] = useState('')
    const { copy, read, clear, text, copied, isSupported } = useClipboard({
        onSuccess: (copiedText) => {
            if (copiedText && copiedText.trim()) {
                setHistory((prev) => [copiedText, ...prev.slice(0, 9)])
            }
        },
    })

    const copyFromHistory = (item: string) => {
        copy(item)
    }

    const handleCopyInput = () => {
        if (inputValue) {
            copy(inputValue)
            setInputValue('')
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>Clipboard Manager</h3>
            {!isSupported && (
                <div
                    style={{
                        padding: '10px',
                        background: '#fee',
                        borderRadius: '4px',
                        marginBottom: '20px',
                    }}
                >
                    ⚠️ Clipboard API not supported in this environment
                </div>
            )}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                }}
            >
                <div>
                    <h4>Controls</h4>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Enter text to copy"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            style={{
                                padding: '8px',
                                width: '100%',
                                marginBottom: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                            }}
                        />
                        <Button
                            onClick={handleCopyInput}
                            style={{ width: '100%' }}
                        >
                            Copy to Clipboard
                        </Button>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <Button onClick={read} style={{ width: '100%' }}>
                            Read Clipboard
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={clear}
                            variant="secondary"
                            style={{ width: '100%' }}
                        >
                            Clear Clipboard
                        </Button>
                    </div>
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '10px',
                            background: copied ? '#efe' : '#f5f5f5',
                            borderRadius: '4px',
                        }}
                    >
                        <strong>Current:</strong>
                        <div
                            style={{
                                marginTop: '5px',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                wordBreak: 'break-word',
                            }}
                        >
                            {text || '(empty)'}
                        </div>
                    </div>
                </div>
                <div>
                    <h4>History (last 10)</h4>
                    <div
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                        }}
                    >
                        {history.length === 0 ? (
                            <div style={{ padding: '20px', color: '#999' }}>
                                No history yet
                            </div>
                        ) : (
                            history.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '10px',
                                        borderBottom:
                                            i < history.length - 1
                                                ? '1px solid #eee'
                                                : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            fontFamily: 'monospace',
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            marginRight: '10px',
                                        }}
                                    >
                                        {item}
                                    </div>
                                    <Button
                                        onClick={() => copyFromHistory(item)}
                                        size="small"
                                    >
                                        Copy
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    {history.length > 0 && (
                        <Button
                            onClick={() => setHistory([])}
                            variant="secondary"
                            style={{ marginTop: '10px', width: '100%' }}
                        >
                            Clear History
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export const ClipboardManager: Story = {
    render: () => <ClipboardManagerDemo />,
}
