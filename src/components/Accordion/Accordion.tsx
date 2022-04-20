import React from 'react'

import './accordion.scss'

const Accordion = () => {
    return (
        <>
            <details>
                <summary>Headline 1</summary>
                <div>
                    <p>Test</p>
                </div>
            </details>
            <details>
                <summary>Headline 2</summary>
                <div>
                    <p>Test</p>
                </div>
            </details>
        </>
    )
}

export default Accordion
