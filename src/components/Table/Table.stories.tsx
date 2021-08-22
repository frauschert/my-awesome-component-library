import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Table from './Table'
import { ColumnDefinitionType, SortConfig, TableProps } from './types'

export default {
    title: 'Components/Table',
    component: Table,
} as Meta

interface WeatherForecast {
    date: string
    temperatureC: number
    temperatureF: number
    summary: string
}

const columns: ColumnDefinitionType<WeatherForecast, keyof WeatherForecast>[] =
    [
        {
            key: 'date',
            header: 'Date',
            width: 150,
        },
        {
            key: 'temperatureC',
            header: 'Temp. (C)',
        },
        {
            key: 'temperatureF',
            header: 'Temp. (F)',
        },
        {
            key: 'summary',
            header: 'Summary',
        },
    ]

const defaultForecasts: WeatherForecast[] = [
    {
        date: new Date(2021, 5).toISOString(),
        temperatureC: 5,
        temperatureF: 6,
        summary: 'jo',
    },
    {
        date: new Date(2021, 11).toISOString(),
        temperatureC: 4,
        temperatureF: 7,
        summary: 'oj',
    },
]

const sortConfig: SortConfig<WeatherForecast, keyof WeatherForecast> = {
    sortKey: 'date',
    sortDirection: 'descending',
}

// Create a master template for mapping args to render the Button component
const Template =
    <T, K extends keyof T>(): Story<TableProps<T, K>> =>
    (args) => {
        return <Table {...args} />
    }

export const Normal = Template<WeatherForecast, keyof WeatherForecast>().bind(
    {}
)
Normal.args = {
    data: defaultForecasts,
    columns: columns,
    sortConfig: sortConfig,
}
