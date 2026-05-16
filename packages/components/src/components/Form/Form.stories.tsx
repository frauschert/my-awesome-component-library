import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import Form from './Form'
import FormGroup from './FormGroup'
import FormActions from './FormActions'
import Button from '../Button'

const meta: Meta<typeof Form> = {
    title: 'Components/Form',
    component: Form,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Form>

const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
}

export const Basic: Story = {
    render: () => {
        const [formData, setFormData] = useState({ name: '', email: '' })

        return (
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    alert(`Submitted: ${JSON.stringify(formData, null, 2)}`)
                }}
            >
                <FormGroup label="Name" required>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        style={inputStyle}
                        required
                    />
                </FormGroup>

                <FormGroup
                    label="Email"
                    required
                    hint="We'll never share your email"
                >
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        style={inputStyle}
                        required
                    />
                </FormGroup>

                <FormActions>
                    <Button variant="secondary" type="button">
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </FormActions>
            </Form>
        )
    },
}

export const WithValidation: Story = {
    render: () => {
        const [formData, setFormData] = useState({ email: '', password: '' })
        const [errors, setErrors] = useState<Record<string, string>>({})

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            const newErrors: Record<string, string> = {}
            if (!formData.email) newErrors.email = 'Email is required'
            else if (!/\S+@\S+\.\S+/.test(formData.email))
                newErrors.email = 'Email is invalid'
            if (!formData.password) newErrors.password = 'Password is required'
            else if (formData.password.length < 8)
                newErrors.password = 'Password must be at least 8 characters'
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors)
                return
            }
            setErrors({})
            alert('Form is valid!')
        }

        return (
            <Form onSubmit={handleSubmit}>
                <FormGroup
                    label="Email"
                    required
                    error={errors.email}
                    description="Your work email address"
                >
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value })
                            if (errors.email)
                                setErrors({ ...errors, email: '' })
                        }}
                        style={inputStyle}
                    />
                </FormGroup>
                <FormGroup
                    label="Password"
                    required
                    error={errors.password}
                    hint="Must be at least 8 characters"
                >
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                            if (errors.password)
                                setErrors({ ...errors, password: '' })
                        }}
                        style={inputStyle}
                    />
                </FormGroup>
                <FormActions>
                    <Button type="submit">Sign In</Button>
                </FormActions>
            </Form>
        )
    },
}

export const HorizontalLayout: Story = {
    render: () => (
        <Form layout="horizontal">
            <FormGroup label="Name">
                <input type="text" name="name" style={inputStyle} />
            </FormGroup>
            <FormGroup label="Email">
                <input type="email" name="email" style={inputStyle} />
            </FormGroup>
            <FormGroup label="Phone">
                <input type="tel" name="phone" style={inputStyle} />
            </FormGroup>
            <FormActions>
                <Button variant="secondary">Cancel</Button>
                <Button type="submit">Save</Button>
            </FormActions>
        </Form>
    ),
}

export const InlineLayout: Story = {
    render: () => (
        <Form layout="inline">
            <input
                placeholder="Search..."
                name="query"
                style={{ ...inputStyle, width: '200px' }}
            />
            <input
                placeholder="Location"
                name="location"
                style={{ ...inputStyle, width: '150px' }}
            />
            <Button type="submit">Search</Button>
        </Form>
    ),
}

export const SizeVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3>Small</h3>
                <Form size="sm">
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions>
                        <Button type="submit">Submit</Button>
                    </FormActions>
                </Form>
            </div>
            <div>
                <h3>Medium (Default)</h3>
                <Form size="md">
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions>
                        <Button type="submit">Submit</Button>
                    </FormActions>
                </Form>
            </div>
            <div>
                <h3>Large</h3>
                <Form size="lg">
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions>
                        <Button type="submit">Submit</Button>
                    </FormActions>
                </Form>
            </div>
        </div>
    ),
}

export const DisabledState: Story = {
    render: () => (
        <Form disabled>
            <FormGroup label="Name">
                <input
                    type="text"
                    name="name"
                    defaultValue="John Doe"
                    style={inputStyle}
                />
            </FormGroup>
            <FormGroup label="Email">
                <input
                    type="email"
                    name="email"
                    defaultValue="john@example.com"
                    style={inputStyle}
                />
            </FormGroup>
            <FormActions>
                <Button type="submit">Submit</Button>
            </FormActions>
        </Form>
    ),
}

export const ContactForm: Story = {
    render: () => {
        const [submitted, setSubmitted] = useState(false)
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>Contact Us</h2>
                {submitted ? (
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: '#d1fae5',
                            borderRadius: '0.375rem',
                            color: '#065f46',
                        }}
                    >
                        Thank you! We'll get back to you soon.
                    </div>
                ) : (
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault()
                            setSubmitted(true)
                        }}
                    >
                        <FormGroup label="Name" required>
                            <input
                                type="text"
                                name="name"
                                style={inputStyle}
                                required
                            />
                        </FormGroup>
                        <FormGroup
                            label="Email"
                            required
                            description="We'll use this to respond to your message"
                        >
                            <input
                                type="email"
                                name="email"
                                style={inputStyle}
                                required
                            />
                        </FormGroup>
                        <FormGroup label="Subject" required>
                            <input
                                type="text"
                                name="subject"
                                style={inputStyle}
                                required
                            />
                        </FormGroup>
                        <FormGroup label="Message" required>
                            <textarea
                                name="message"
                                rows={5}
                                style={{ ...inputStyle, fontFamily: 'inherit' }}
                                required
                            />
                        </FormGroup>
                        <FormActions>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => setSubmitted(false)}
                            >
                                Reset
                            </Button>
                            <Button type="submit">Send Message</Button>
                        </FormActions>
                    </Form>
                )}
            </div>
        )
    },
}

export const ActionsAlignment: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h3>Right Aligned (Default)</h3>
                <Form>
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions align="right">
                        <Button variant="secondary">Cancel</Button>
                        <Button type="submit">Save</Button>
                    </FormActions>
                </Form>
            </div>
            <div>
                <h3>Left Aligned</h3>
                <Form>
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions align="left">
                        <Button type="submit">Save</Button>
                        <Button variant="secondary">Cancel</Button>
                    </FormActions>
                </Form>
            </div>
            <div>
                <h3>Center Aligned</h3>
                <Form>
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions align="center">
                        <Button type="submit">Save</Button>
                    </FormActions>
                </Form>
            </div>
            <div>
                <h3>Space Between</h3>
                <Form>
                    <FormGroup label="Name">
                        <input type="text" name="name" style={inputStyle} />
                    </FormGroup>
                    <FormActions align="space-between">
                        <Button variant="secondary">Back</Button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button variant="secondary">Cancel</Button>
                            <Button type="submit">Next</Button>
                        </div>
                    </FormActions>
                </Form>
            </div>
        </div>
    ),
}
