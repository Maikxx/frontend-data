// import { Result } from './types/Query'

// export const getLanguageFromResult = (result?: Result): string => {
//     return result.languages
//         && result.languages.language
//         && result.languages.language.$t
//         || undefined
// }

// export const getAuthorFromResult = (result?: Result): string => {
//     return result.authors
//         && result.authors.author
//         && result.authors.author.$t
//         || undefined
// }

// export const getGenreFromResult = (result?: Result): string | string[] => {
//     const genres = result.genres

//     if (genres && genres.genre) {
//         const genre = genres.genre

//         if (Array.isArray(genre)) {
//             return genre.map(genre => genre.$t)
//         } else {
//             return genre.$t
//         }
//     }

//     return undefined
// }

// export const getTitleFromResult = (result?: Result): string => {
//     return result.titles
//         && result.titles['short-title']
//         && result.titles['short-title'].$t
//         || undefined
// }

// export const getYearOfPublicationFromResult = (result?: Result): number => {
//     return result.publication
//         && result.publication.year
//         && result.publication.year.$t
//         && Number(result.publication.year.$t)
//         || undefined
// }

const getCleanPublicationLocation = (publicationLocation: string) => {
    return publicationLocation
        .replace(/\[|\]/g, '')
        .replace('etc.', '')
        .trim()
}

export const getTransformedDataFromResults = (result?: any) => {
    const cleanPublicationLocation = result.publication
        && result.publication.place
        && getCleanPublicationLocation(result.publication.place)

    const shortTitle = result.title && result.title.short
    const publicationYear = result.publication && result.publication.year && Number(result.publication.year)

    return {
        locationName: cleanPublicationLocation,
        lat: undefined,
        long: undefined,
        book: shortTitle,
        publicationYear,
    }
}
