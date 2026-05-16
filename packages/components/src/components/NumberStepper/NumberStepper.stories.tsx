import React from 'react'
import NumberStepper from './NumberStepper'

export default {
    title: 'Components/NumberStepper',
    component: NumberStepper,
}

export const Default = () => <NumberStepper defaultValue={0} />

export const WithLabel = () => (
    <NumberStepper
        label="Quantity"
        id="qty"
        defaultValue={1}
        min={0}
        max={99}
    />
)

export const WithMinMax = () => (
    <NumberStepper
        defaultValue={5}
        min={0}
        max={10}
        label="Rating (0-10)"
        id="rating"
    />
)

export const CustomStep = () => (
    <NumberStepper defaultValue={0} step={0.5} label="Amount" id="amount" />
)

export const Sizes = () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
        <NumberStepper size="small" defaultValue={0} label="Small" id="sm" />
        <NumberStepper size="medium" defaultValue={0} label="Medium" id="md" />
        <NumberStepper size="large" defaultValue={0} label="Large" id="lg" />
    </div>
)

export const WithError = () => (
    <NumberStepper
        defaultValue={11}
        max={10}
        error="Maximum is 10"
        label="Items"
        id="err"
    />
)

export const Disabled = () => (
    <NumberStepper defaultValue={3} disabled label="Disabled" id="dis" />
)
