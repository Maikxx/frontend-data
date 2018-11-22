import turfLength from '@turf/length'
import { getWeatherImpactOnFlySpeed, getReadableFlyTime } from '../getters/planes'
import { filterLinesByCityName } from '../filters/cities'
import { state } from '../client'

export const setFlightTimeAndDistance = async (cityName) => {
    const flySpeedWithWeatherImpact = await getWeatherImpactOnFlySpeed()

    const lineByCityName = filterLinesByCityName(cityName)[0]
    const distanceBetweenCities = turfLength(lineByCityName, 'kilometers')
    state.interactionOptions.distanceBetweenCities = distanceBetweenCities

    const flyTimeInMinutes = distanceBetweenCities / flySpeedWithWeatherImpact * 60
    state.interactionOptions.flyTimeInMinutes = flyTimeInMinutes
    state.interactionOptions.readableFlyTime = getReadableFlyTime()
    state.interactionOptions.cityName = cityName
}