import turfAlong from '@turf/along'
import turfLength from '@turf/length'
import { path } from '../client'
import { getNormalColorScale, getHoverColorScale } from '../getters/scales'
import { getTransformedCityName, getCityStyleClassFromData } from '../getters/cities'
import { state } from '../client'
import { handleCircleClick } from '../setters/interaction'
import { triggerUpdate } from '../updaters/general'
import * as d3 from 'd3'

const createArc = (d) => {
    // Heavily inspired by MapBox's (2018) example about animating a point along a route.
    const lineDistance = turfLength(d, 'kilometers')
    const arc = []

    const steps = 40

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turfAlong(d, i, 'kilometers')
        arc.push(segment.geometry.coordinates)
    }

    d.geometry.coordinates = arc
    return path(d)
}

const drawLines = () => {
    const { geoJson, svg } = state
    const { lines } = geoJson
    const normalColorScale = getNormalColorScale()

    svg.selectAll('path')
        .data(lines.features)
        .enter()
        .append('path')
            .attr('d', createArc)
            .attr('class', d => `line line--${getTransformedCityName(d.properties.fromCity)}`)
            .style('stroke', d => {
                const { cities } = geoJson
                const { features } = cities
                const cityName = d.properties.fromCity
                const filteredCity = features.filter(feature => feature.properties.name === cityName)[0]
                const { books } = filteredCity.properties
                const amountOfBooks = books.length

                return normalColorScale(amountOfBooks)
            })

    triggerUpdate()
}

const getNormalFillOrStrokeColor = (d) => {
    const { properties } = d
    const normalColorScale = getNormalColorScale()

    return properties.name !== 'Amsterdam' && normalColorScale(properties.books.length)
}

const getHoverFillOrStrokeColor = (d) => {
    const { properties } = d
    const hoverColorScale = getHoverColorScale()

    return properties.name !== 'Amsterdam' && hoverColorScale(properties.books.length)
}

export const drawCircles = () => {
    const { geoJson, svg } = state
    const { cities } = geoJson

    svg.selectAll('circle')
        .data(cities.features)
        .enter()
        .append('circle')
            .attr('r', 9)
            .attr('class', getCityStyleClassFromData)
            .style('fill', getNormalFillOrStrokeColor)
            .style('stroke', getNormalFillOrStrokeColor)
            .on('click', handleCircleClick)
            .on('mouseover', function() {
                d3.select(this)
                    .style('fill', getHoverFillOrStrokeColor)
                    .style('stroke', getHoverFillOrStrokeColor)
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .style('fill', getNormalFillOrStrokeColor)
                    .style('stroke', getNormalFillOrStrokeColor)
            })

    drawLines()
}