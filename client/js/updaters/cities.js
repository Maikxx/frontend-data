import { project } from '../client'
import { state } from '../client'

export const updateCities = (transitionTime) => {
    const { svg } = state

    svg.selectAll('.city')
        .transition()
        .duration(transitionTime)
            .attr('cx', d => project(d.geometry.coordinates).x )
            .attr('cy', d => project(d.geometry.coordinates).y )
}

export const updateLines = (transitionTime, path) => {
    const { svg } = state

    svg.selectAll('path')
        .transition()
        .duration(transitionTime)
            .attr('d', path)
}