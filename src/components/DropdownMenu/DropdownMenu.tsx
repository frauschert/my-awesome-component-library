import React, { useRef, useState } from 'react'
import { useDetectOutsideClick } from '../../utility/hooks/useDetectOutsideClick'

import './dropdownmenu.css'

const DropdownMenu = () => {
    const dropdownRef = useRef<HTMLElement>(null)
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
    const onClick = () => setIsActive(!isActive)

    return (
        <div className="menu-container">
            <button onClick={onClick} className="menu-trigger">
                <span>User</span>
                <img
                    src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/df/df7789f313571604c0e4fb82154f7ee93d9989c6.jpg"
                    alt="User avatar"
                />
            </button>
            <nav
                ref={dropdownRef}
                className={`menu ${isActive ? 'active' : 'inactive'}`}
            >
                <ul>
                    <li>
                        <a href="/messages">Messages</a>
                    </li>
                    <li>
                        <a href="/trips">Trips</a>
                    </li>
                    <li>
                        <a href="/saved">Saved</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default DropdownMenu
