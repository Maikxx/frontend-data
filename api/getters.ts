// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

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
