import * as d3 from 'd3'
import { getMinAmountOfBooks, getMaxAmountOfBooks } from '../getters/amountOfBooks'

export const createScaleLegend = () => {
    const node = document.getElementById('legend-item-list')
    const { width } = node.getBoundingClientRect()
    const titleNode = document.createElement('h3')

    titleNode.textContent = 'Aantal boeken'

    const li = document.createElement('li')

    li.appendChild(titleNode)
    li.id = 'legend-item--scale'
    node.appendChild(li)

    const height = 20

    const key = d3.select('#legend-item--scale')
        .append('svg')
        .attr('id', 'scale-svg')
        .attr('width', width - 20)
        .attr('height', height)

    const legend = key.append('defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad')

    legend.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#66FCF1')
        .attr('stop-opacity', 1)

    legend.append('stop')
        .attr('offset', '33%')
        .attr('stop-color', '#54B8D7')
        .attr('stop-opacity', 1)

    legend.append('stop')
        .attr('offset', '66%')
        .attr('stop-color', '#4173BC')
        .attr('stop-opacity', 1)

    legend.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#2F2FA2')
        .attr('stop-opacity', 1)

    key.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(#gradient)')

    const startNode = document.createElement('span')
    const endNode = document.createElement('span')
    const divNode = document.createElement('div')

    startNode.textContent = getMinAmountOfBooks()
    endNode.textContent = getMaxAmountOfBooks()
    divNode.appendChild(startNode)
    divNode.appendChild(endNode)
    li.appendChild(divNode)
}