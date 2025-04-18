import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import Table from './Table'
import type {
    ColumnDefinitionType,
    RowDefinitionType,
    SortConfig,
    TableProps,
} from './types'
import { ThemeProvider, ThemeSwitcher } from '../Theme'
import exp from 'constants'

const meta: Meta<typeof Table> = {
    title: 'Components/Table',
    component: Table,
}
export default meta

type Story = StoryObj<typeof Table>
