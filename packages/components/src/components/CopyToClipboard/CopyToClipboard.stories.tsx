import React from 'react'
import CopyToClipboard from './CopyToClipboard'

export default {
    title: 'Components/CopyToClipboard',
    component: CopyToClipboard,
}

export const Default = () => <CopyToClipboard text="Hello, World!" />

export const CustomLabels = () => (
    <CopyToClipboard
        text="npm install my-lib"
        label="Copy command"
        copiedLabel="Done!"
    />
)

export const Sizes = () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <CopyToClipboard text="small" size="small" label="Small" />
        <CopyToClipboard text="medium" size="medium" label="Medium" />
        <CopyToClipboard text="large" size="large" label="Large" />
    </div>
)

export const Variants = () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <CopyToClipboard text="primary" variant="primary" label="Primary" />
        <CopyToClipboard
            text="secondary"
            variant="secondary"
            label="Secondary"
        />
        <CopyToClipboard text="ghost" variant="ghost" label="Ghost" />
    </div>
)

export const IconOnly = () => (
    <CopyToClipboard text="secret" label="" copiedLabel="" />
)

export const Disabled = () => <CopyToClipboard text="can't copy" disabled />

export const WithCallback = () => (
    <CopyToClipboard
        text="callback text"
        onCopy={(text, success) => alert(`Copied "${text}": ${success}`)}
    />
)
