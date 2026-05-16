import React, { ReactNode } from 'react'

import { Provider } from './ThemeContext'
import { ThemeWrapper } from './ThemeWrapper'

type ThemeProviderProps = {
    children: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    return (
        <Provider>
            <ThemeWrapper>{children}</ThemeWrapper>
        </Provider>
    )
}

export default ThemeProvider
