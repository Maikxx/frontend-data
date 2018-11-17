import { LocationIQPlace } from './types/Location'
import { TransformedBook, BooksByLocation } from './types/Book'

export const filterBooksByLocationByLocationName = (booksByLocation: BooksByLocation) => {
    return booksByLocation.values.filter((book: TransformedBook) => book.locationName)
}

export const filterApiLocationByLocationName = (apiLocation: LocationIQPlace, locationName: string): boolean => {
    const { display_name: displayName } = apiLocation

    if (!displayName || !locationName || locationName === 'undefined' || locationName === 'UK') {
        return false
    }

    const apiLocationName = displayName.toLowerCase()
    const nestedLocationName = locationName.toLowerCase()

    return apiLocationName.includes(nestedLocationName)
}
