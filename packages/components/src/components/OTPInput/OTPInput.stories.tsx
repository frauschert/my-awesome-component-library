import React from 'react'
import OTPInput from './OTPInput'

export default {
    title: 'Components/OTPInput',
    component: OTPInput,
}

export const Default = () => <OTPInput />

export const FourDigits = () => <OTPInput length={4} />

export const WithDefaultValue = () => (
    <OTPInput length={6} defaultValue="123456" />
)

export const NumericOnly = () => <OTPInput length={6} type="number" />

export const Masked = () => <OTPInput length={6} mask />

export const Sizes = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <OTPInput size="small" length={4} />
        <OTPInput size="medium" length={4} />
        <OTPInput size="large" length={4} />
    </div>
)

export const WithError = () => (
    <OTPInput length={6} error="Invalid verification code" />
)

export const Disabled = () => (
    <OTPInput length={6} defaultValue="123" disabled />
)
