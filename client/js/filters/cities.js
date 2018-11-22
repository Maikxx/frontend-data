import { getTransformedCityName } from '../getters/cities'
import { state } from '../client'

export const filterLinesByCityName = (cityName) => {
    const { lines } = state.geoJson

    return lines.features.filter(feature => {
        const { fromCity } = feature.properties
        const transformedCityName = getTransformedCityName(fromCity)

        return transformedCityName === cityName
    })
}