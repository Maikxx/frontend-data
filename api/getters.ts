import { Result } from './types/Query'
import * as uniqBy from 'lodash.uniqby'
import * as uniq from 'lodash.uniq'

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

const getResultsByLanguageAndYear = (results: Result[], language: string, year: number) => {
    return results.filter(result => {
        const resultLanguage = getLanguageFromResult(result)
        const resultPublicationYear = getYearOfPublicationFromResult(result)

        return resultLanguage === language && resultPublicationYear === year
    })
}

const getAuthorsByGenre = (allResultsByGenre: Result[]) => {
    return allResultsByGenre.map(resultByGenre => {
        const author = getAuthorFromResult(resultByGenre)
        const transformedAuthor = author.replace(/\./g, '').trim()
        return transformedAuthor
    })
}

const getUniqueAuthorsByGenre = (allAuthorsByGenre: string[]) => {
    return uniq(allAuthorsByGenre)
}

const getTitlesByAuthorFromResultByGenre = (allResultsByGenre: Result[], author: string) => {
    return allResultsByGenre
        .filter(result => {
            const resultAuthor = getAuthorFromResult(result)
            return resultAuthor === author
        })
        .map(result => {
            const title = getTitleFromResult(result)
            return {
                name: title,
                size: title.length,
            }
        })
}

const getUniqueResultsByGenre = (resultsByLanguageAndYear: Result[], allResults: Result[]) => {
    return uniqBy(resultsByLanguageAndYear.map(result => {
        const genre = getGenreFromResult(result) as string
        const allResultsByGenre = allResults.filter(allResultResult => getGenreFromResult(allResultResult) === genre)
        const uniqueAuthorsFromAllResults = getUniqueAuthorsByGenre(getAuthorsByGenre(allResultsByGenre))

        return {
            name: genre,
            children: uniqueAuthorsFromAllResults.map(author => ({
                name: author,
                children: getTitlesByAuthorFromResultByGenre(allResultsByGenre, author),
            })),
        }
    }), 'name')
}

export const getDataStructureFromResults = (results: Result[]) => {
    const resultsByLanguageAndYear = getResultsByLanguageAndYear(results, 'dut', 2014)
    const genresByLanguageAndYear = getUniqueResultsByGenre(resultsByLanguageAndYear, results)

    return {
        name: 'genres',
        children: genresByLanguageAndYear,
    }
}
