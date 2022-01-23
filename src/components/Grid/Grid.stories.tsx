import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Grid, { GridProps } from './Grid'

export default {
    title: 'Components/Grid',
    component: Grid,
} as Meta

const style: React.CSSProperties = {
    background: 'tomato',
    padding: '5px',

    marginTop: '10px',
    lineHeight: '150px',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
}

const items = ['Create', 'Edit', 'Download', 'Import', 'Export', 'Print']

const Template: Story<GridProps> = (args) => (
    <Grid>
        {items.map((item, index) => (
            <div key={index} style={style}>
                {item}
            </div>
        ))}
    </Grid>
)

export const Example = Template.bind({})
Example.parameters = {
    layout: 'centered',
}
