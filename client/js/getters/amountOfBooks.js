import * as d3 from 'd3'
import { state } from '../client'

export const getMinAmountOfBooks = () => {
    const { features } = state.geoJson.cities
    return d3.min(features, f => f.properties.books.length)
}

export const getMaxAmountOfBooks = () => {
    const { features } = state.geoJson.cities
    return d3.max(features, f => f.properties.books.length)
}