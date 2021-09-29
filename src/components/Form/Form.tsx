import React from 'react'

const Form = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit}>
            <fieldset></fieldset>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Form
