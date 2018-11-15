import { Result } from './types/Query'

export const getTransformedCityData = (cityData: string) => {
    return cityData
        .split(/\n/g)
        .map(city => city.split(/\,/g))
        .map(city => ({
            countryCode: city[0],
            cityName: city[2],
            latitude: city[5],
            longitude: city[6],
        }))
}

export const getLanguageFromResult = (result?: Result): string => {
    return result.languages
        && result.languages.language
        && result.languages.language.$t
        || undefined
}

export const getAuthorFromResult = (result?: Result): string => {
    return result.authors
        && result.authors.author
        && result.authors.author.$t
        || undefined
}

export const getGenreFromResult = (result?: Result): string | string[] => {
    const genres = result.genres

    if (genres && genres.genre) {
        const genre = genres.genre

        if (Array.isArray(genre)) {
            return genre.map(genre => genre.$t)
        } else {
            return genre.$t
        }
    }

    return undefined
}

export const getTitleFromResult = (result?: Result): string => {
    return result.titles
        && result.titles['short-title']
        && result.titles['short-title'].$t
        || undefined
}

export const getYearOfPublicationFromResult = (result?: Result): number => {
    return result.publication
        && result.publication.year
        && result.publication.year.$t
        && Number(result.publication.year.$t)
        || undefined
}

const getCleanPublicationLocation = (publicationLocation: string) => {
    return publicationLocation
        .replace(/\[|\]/g, '')
        .replace('etc.', '')
        .trim()
}

export const getPublicationLocationFromResults = (result?: Result): string => {
    return result.publication
        && result.publication.publishers
        && result.publication.publishers.publisher
        && result.publication.publishers.publisher.place
        && getCleanPublicationLocation(result.publication.publishers.publisher.place)
        || undefined
}
