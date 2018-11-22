import { updateCities, updateLines } from './cities'
import { path, state } from '../client'

export const update = (transitionTime = 5) => {
    updateCities(transitionTime)
    updateLines(transitionTime, path)
}

export const triggerUpdate = () => {
    const { globe } = state

    update()

    globe.on('viewreset', update)
    globe.on('move', update)
    globe.on('moveend', update)
}