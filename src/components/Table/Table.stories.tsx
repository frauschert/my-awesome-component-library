import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Table from './Table'
import { ColumnDefinitionType, SortConfig, TableProps } from './types'
import { ThemeProvider, ThemeSwitcher } from '../Theme'

export default {
    title: 'Components/Table',
    component: Table,
} as Meta

interface Person {
    id: number
    firstName: string
    lastName: string
    age: number
}

const columns: ColumnDefinitionType<Person, keyof Person>[] = [
    {
        key: 'id',
        header: 'ID',
    },
    {
        key: 'firstName',
        header: 'First name',
    },
    {
        key: 'lastName',
        header: 'Last name',
        width: 300,
    },
    {
        key: 'age',
        header: 'Age',
    },
]

const defaultData: Person[] = [
    {
        id: 1,
        firstName: 'Michael',
        lastName: 'Scheider',
        age: 47,
    },
    {
        id: 2,
        firstName: 'Fabian',
        lastName: 'Schlottke',
        age: 30,
    },
    {
        id: 3,
        firstName: 'Denis',
        lastName: 'Döll',
        age: 4,
    },
]

const sortConfig: SortConfig<Person, keyof Person> = {
    sortKey: 'id',
    sortDirection: 'descending',
}

const props = {}

// Create a master template for mapping args to render the Button component
const Template =
    <T, K extends keyof T>(): Story<TableProps<T, K>> =>
    (args) => {
        return <Table {...args} />
    }

export const Normal = Template<Person, keyof Person>().bind({})
Normal.args = {
    data: defaultData,
    columns: columns,
    sortConfig: sortConfig,
}
export const WithTheme = Template<Person, keyof Person>().bind({})
WithTheme.args = {
    data: defaultData,
    columns: columns,
    sortConfig: sortConfig,
}
WithTheme.decorators = [
    (Story) => (
        <ThemeProvider>
            <Story />
            <ThemeSwitcher></ThemeSwitcher>
        </ThemeProvider>
    ),
]
