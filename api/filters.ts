import { LocationIQPlace } from './types/Location'

export const filterApiLocationByLocationName = (apiLocation: LocationIQPlace, locationName: string): boolean => {
    const { display_name: displayName } = apiLocation

    if (!displayName || !locationName || locationName === 'undefined' || locationName === 'UK') {
        return false
    }

    const apiLocationName = displayName.toLowerCase()
    const nestedLocationName = locationName.toLowerCase()

    return apiLocationName.includes(nestedLocationName)
}
