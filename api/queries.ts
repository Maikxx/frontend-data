import { Query, Facet, Result } from './types/Query'

const API = require('node-oba-api-wrapper')

// API
const client = new API({
    public: process.env.PUBLIC,
    secret: process.env.SECRET,
})

export const search = async (query: Query, facet: Facet, amount: number): Promise<Result[]> => {
    return await client.get('search', {
        q: query,
        librarian: true,
        refine: true,
        facet,
        count: amount,
        // filter: result => {console.log(result)},
    })
}
