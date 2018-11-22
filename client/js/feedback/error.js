import * as d3 from 'd3'

export const toastError = (error) => {
    const tIn = d3.transition()
        .duration(300)
        .ease(d3.easeLinear)

    const tOut = d3.transition()
        .delay(2000)
        .duration(300)
        .ease(d3.easeLinear)

    d3.select('#error-toast')
        .text(error)
        .transition(tIn)
        .style('bottom', '0px')

    d3.select('#error-toast')
        .transition(tOut)
        .style('bottom', '-34px')

    throw new Error(error)
}