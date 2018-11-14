import { Query, Facet, Result } from './types/Query'
import { getYearOfPublicationFromResult, getAuthorFromResult, getGenreFromResult } from './getters'

const API = require('node-oba-api-wrapper')

// API
const client = new API({
    public: process.env.PUBLIC,
    secret: process.env.SECRET,
})

export const search = async (query: Query, facet: Facet, amount?: number): Promise<Result[]> => {
    return await client.get('search', {
        q: query,
        refine: true,
        facet,
        count: amount || 100,
        filter: (result: Result) => {
            const tenYearsAgo = new Date().getFullYear() - 10
            const publicationYear = getYearOfPublicationFromResult(result)
            const genreOrGenres = getGenreFromResult(result)

            return publicationYear >= tenYearsAgo
                && !!getAuthorFromResult(result)
                && (genreOrGenres && !Array.isArray(genreOrGenres))
        },
    })
}

export const queryAll = async (): Promise<Result[]> => {
    const dutchBooks = await search('language:dut', ['type(book)'])
    const englishBooks = await search('language:eng', ['type(book)'])
    const germanBooks = await search('language:ger', ['type(book)'])
    const frenchBooks = await search('language:fre', ['type(book)'])
    const russianBooks = await search('language:rus', ['type(book)'])
    const spanishBooks = await search('language:spa', ['type(book)'])

    return [
        ...dutchBooks,
        ...englishBooks,
        ...germanBooks,
        ...frenchBooks,
        ...russianBooks,
        ...spanishBooks,
    ]
}
