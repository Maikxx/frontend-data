import { Result } from './types/Query'

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

export const getMainAuthorFromResult = (result?: Result): string => {
    return result.authors
        && result.authors['main-author']
        && result.authors['main-author'].$t
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

const getTitlesByAuthor = (results: Result[], author: string) => {
    const resultsByAuthor = results.filter(result => (
        getAuthorFromResult(result) === author || getMainAuthorFromResult(result) === author
    ))

    return resultsByAuthor.map(result => ({
        name: getTitleFromResult(result),
        size: getTitleFromResult(result).length,
    }))
}

const getAuthorsByGenre = (results: Result[], genre: string | string[]) => {
    return results
        .filter(result => {
            const resultGenre = getGenreFromResult(result)

            if (Array.isArray(genre) && !Array.isArray(resultGenre)) {
                return genre.includes(resultGenre)
            } else if (!Array.isArray(genre) && Array.isArray(resultGenre)) {
                return resultGenre.includes(genre)
            } else if (Array.isArray(genre) && Array.isArray(resultGenre)) {
                return genre.filter(g => resultGenre.includes(g))
            }
        })
        .map(result => {
            const author = getAuthorFromResult(result) || getMainAuthorFromResult(result)

            return {
                name: author,
                children: getTitlesByAuthor(results, author),
            }
        })
}

export const getDataStructureFromResults = (results: Result[]) => {
    const resultsByLanguageAndYear = getResultsByLanguageAndYear(results, 'dut', 2014)

    const genresByLanguageAndYear = resultsByLanguageAndYear.map(result => {
        const genre = Array.isArray(getGenreFromResult(result))
            ? getGenreFromResult(result)[0]
            : getGenreFromResult(result)

        return {
            name: genre,
            children: getAuthorsByGenre(results, genre),
        }
    })

    console.dir(genresByLanguageAndYear, { depth: null })

    return {
        name: 'genres',
        children: genresByLanguageAndYear,
    }
}
