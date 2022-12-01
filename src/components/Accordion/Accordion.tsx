import React, { useState } from 'react'

import './accordion.scss'

type AccordionProps = { items: AccordionItemProps[] }
type AccordionItemProps = { title: React.ReactNode; content: React.ReactNode }

const Accordion = ({ items }: AccordionProps) => {
    return (
        <div className="accordion">
            {items.map((itemProps, index) => (
                <AccordionItem key={index} {...itemProps} />
            ))}
        </div>
    )
}

function AccordionItem({ title, content }: AccordionItemProps) {
    const [isActive, setIsActive] = useState(false)

    return (
        <div className="accordion-item">
            <div
                className="accordion-title"
                onClick={() => setIsActive(!isActive)}
            >
                <div>{title}</div>
                <div>{isActive ? '-' : '+'}</div>
            </div>
            {isActive && <div className="accordion-content">{content}</div>}
        </div>
    )
}

export default Accordion
