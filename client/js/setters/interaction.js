import * as d3 from 'd3'
import { getTransformedCityName } from '../getters/cities'
import { setFlightTimeAndDistance } from '../setters/planes'
import { toastError } from '../feedback/error'
import { getCleanPlaneNameFromSelectedPlane, getSpeedFromSelectedPlane } from '../getters/planes'
import { setUISelectionSettings } from './ui'
import { state } from '../client'

export const setLineToActive = (cityName) => {
    const className = `line--${cityName}`

    const t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear)

    d3.select(`.${className}`)
        .transition(t)
        .style('stroke-width', '5')
}

export async function handleCircleClick(d) {
    const { name: cityName, books } = d.properties
    const { geometry : { coordinates } } = d

    const { flySpeed } = state.interactionOptions

    if (cityName === 'Amsterdam') {
        return null
    }

    if (!flySpeed) {
        const error = 'Please, select an airplane first'

        toastError(error)
    }

    state.interactionOptions.fromCityCoordinates = coordinates
    state.interactionOptions.books = books

    d3.selectAll('.line')
        .style('stroke-width', '0')

    d3.selectAll('.city')
        .style('stroke-width', 5)

    d3.select(this)
        .style('stroke-width', 10)

    const transformedCityName = getTransformedCityName(cityName)
    setLineToActive(transformedCityName)

    await setFlightTimeAndDistance(transformedCityName)
    await setUISelectionSettings()
}

export const setWindowZoomListener = () => {
    const { globe, svg } = state

    globe.on('zoom', (e) => {
        const t = d3.transition()
            .duration(300)
            .ease(d3.easeLinear)

        svg.selectAll('circle')
            .transition(t)
            .attr('r', globe.getZoom())
    })
}

async function handleOnSelectorChange({ target }) {
    const selectedOption = target.options[target.selectedIndex]
    const selectedPlane = selectedOption.text
    const { cityName } = state.interactionOptions

    state.interactionOptions.airplane = getCleanPlaneNameFromSelectedPlane(selectedPlane)
    state.interactionOptions.flySpeed = getSpeedFromSelectedPlane(selectedPlane)

    if (cityName) {
        const transformedCityName = getTransformedCityName(cityName)
        await setFlightTimeAndDistance(transformedCityName)
    }

    await setUISelectionSettings()
}

const handleOnAmsterdamLegendItemClick = () => {
    const { globe } = state

    globe.flyTo({
        center: [
            4.899431,
            52.379189,
        ],
        zoom: 9,
    })
}

export const setupListeners = () => {
    const amsterdamLegendElement = document.getElementById('legend-item--amsterdam')
    const selectionElement = document.getElementById('select-plane')

    amsterdamLegendElement.addEventListener('click', handleOnAmsterdamLegendItemClick)
    selectionElement.addEventListener('change', handleOnSelectorChange)
}