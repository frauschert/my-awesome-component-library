import React from 'react'

import './layout.scss'

type LayoutProps = { children: React.ReactNode }
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="container">
            {React.Children.map(children, (child, index) => {
                return (
                    <div className="item" key={index}>
                        {child}
                    </div>
                )
            })}
        </div>
    )
}
