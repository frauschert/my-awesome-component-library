import React, { PropsWithChildren } from 'react'

import './grid.css'

export type GridProps = PropsWithChildren<any>

const Grid = ({ children }: GridProps) => {
    return <div className="grid">{children}</div>
}

export default Grid
