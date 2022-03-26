import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Table from './Table'
import {
    ColumnDefinitionType,
    RowDefinitionType,
    SortConfig,
    TableProps,
} from './types'
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

const columnDefinitions: ColumnDefinitionType<Person, keyof Person>[] = [
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

const defaultData: RowDefinitionType<Person>[] = [
    {
        id: 1,
        data: {
            id: 1,
            firstName: 'Michael',
            lastName: 'Scheider',
            age: 47,
        },
    },
    {
        id: 2,
        data: {
            id: 2,
            firstName: 'Fabian',
            lastName: 'Schlottke',
            age: 30,
        },
        selected: true,
    },
    {
        id: 3,
        data: {
            id: 3,
            firstName: 'Denis',
            lastName: 'Döll',
            age: 4,
        },
    },
    {
        id: 4,
        data: {
            id: 4,
            firstName: 'Michael',
            lastName: 'Scheider',
            age: 47,
        },
    },
    {
        id: 5,
        data: {
            id: 5,
            firstName: 'Fabian',
            lastName: 'Schlottke',
            age: 30,
        },
        selected: true,
    },
    {
        id: 6,
        data: {
            id: 6,
            firstName: 'Denis',
            lastName: 'Döll',
            age: 4,
        },
    },
]

const sortConfig: SortConfig<Person, keyof Person> = {
    sortKey: 'id',
    sortDirection: 'descending',
}

const props: TableProps<Person, keyof Person> = {
    rowDefinitions: defaultData,
    columnDefinitions,
    sortConfig,
}

// Create a master template for mapping args to render the Button component
const Template =
    <T, K extends keyof T>(): Story<TableProps<T, K>> =>
    // eslint-disable-next-line react/display-name
    (args) => {
        return <Table {...args} />
    }

export const Normal = Template<Person, keyof Person>().bind({})
Normal.args = props
export const WithTheme = Template<Person, keyof Person>().bind({})
WithTheme.args = { ...Normal.args }
WithTheme.decorators = [
    (Story) => (
        <ThemeProvider>
            <Story />
            <ThemeSwitcher />
        </ThemeProvider>
    ),
]
