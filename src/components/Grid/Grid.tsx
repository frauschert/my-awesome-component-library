import React, { PropsWithChildren } from 'react'

import './grid.css'

export type GridProps = PropsWithChildren

const Grid = ({ children }: GridProps) => {
    return <div className="grid">{children}</div>
}

export default Grid
