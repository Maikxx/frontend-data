import { Result } from './types/Query'
import * as uniqBy from 'lodash.uniqby'

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

export const getGenreOrGenresFromResult = (result?: Result): string | string[] => {
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

const getResultsByLanguageAndYear = (results: Result[], language: string, year: number) => {
    return results.filter(result => {
        const resultLanguage = getLanguageFromResult(result)
        const resultPublicationYear = getYearOfPublicationFromResult(result)

        return resultLanguage === language && resultPublicationYear === year
    })
}

const getUniqueResultsByGenre = (resultsByLanguageAndYear: Result[], allResults: Result[]) => {
    return uniqBy(resultsByLanguageAndYear.map(result => {
        const genre = getGenreOrGenresFromResult(result) as string

        return {
            name: genre,
            children: getAuthorsByGenre(resultsByLanguageAndYear, genre),
        }
    }), 'name')
}

const getTitlesByAuthorAndGenre = (results: Result[], author: string) => {
    const resultsByAuthor = results.filter(result => {
        return getAuthorFromResult(result) === author
    })

    return resultsByAuthor.map(result => ({
        name: getTitleFromResult(result),
        size: getTitleFromResult(result).length,
    }))
}

const getAuthorsByGenre = (results: Result[], genre: string) => {
    const resultsByGenre = results
        .filter(result => {
            const resultGenre = getGenreOrGenresFromResult(result)
            return genre === resultGenre
        })

    return resultsByGenre
        .map(result => {
            const author = getAuthorFromResult(result)

            return {
                name: author,
                children: getTitlesByAuthorAndGenre(resultsByGenre, author),
            }
        })
}

export const getDataStructureFromResults = (results: Result[]) => {
    // Works
    const resultsByLanguageAndYear = getResultsByLanguageAndYear(results, 'dut', 2014)
    // Broken: Gets unique genres the contents of it are wrong
    const genresByLanguageAndYear = getUniqueResultsByGenre(resultsByLanguageAndYear, results)

    console.dir(genresByLanguageAndYear, { depth: null })

    return {
        name: 'genres',
        children: genresByLanguageAndYear,
    }
}
