import * as d3 from 'd3'

export const animateOnDataLoaded = () => {
    const t = d3.transition()
        .duration(600)
        .ease(d3.easeLinear)

    d3.select('body')
        .transition(t)
        .style('opacity', '1')

    d3.select('.page-header')
        .transition(t)
        .style('transform', 'translateY(0)')

    d3.select('aside')
        .transition(t)
        .style('transform', 'translateX(0)')
}