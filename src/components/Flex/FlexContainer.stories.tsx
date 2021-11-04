import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import FlexContainer, { FlexContainerProps } from './FlexContainer'

export default {
    title: 'Components/FlexContainer',
    component: FlexContainer,
} as Meta

const style: React.CSSProperties = {
    background: 'tomato',
    padding: '5px',
    width: '200px',
    height: '150px',
    marginTop: '10px',
    lineHeight: '150px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '3em',
    textAlign: 'center',
}

const items = ['Create', 'Edit', 'Download', 'Import', 'Export', 'Print']

const Template: Story<FlexContainerProps> = (args) => (
    <FlexContainer {...args}>
        {items.map((item, index) => (
            <div key={index} style={style}>
                {item}
            </div>
        ))}
    </FlexContainer>
)

export const Example = Template.bind({})
Example.args = {
    flexFlow: 'row nowrap',
    gap: '10px 20px',
}
