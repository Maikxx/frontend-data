import { Query, Facet, Result } from './types/Query'
import { getTransformedDataFromResults } from './getters'

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
            const location = getTransformedDataFromResults(result)

            return location && !Array.isArray(location)
        },
    })
}

export const queryAll = async (): Promise<Result[]> => {
    const dutchBooks = await search('language:dut', ['type(book)'])

    return [
        ...dutchBooks,
    ]
}
