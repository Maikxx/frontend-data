import { Query, Facet, Result } from './types/Query'
import { getYearOfPublicationFromResult, getAuthorFromResult, getGenreOrGenresFromResult } from './getters'

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
        count: amount || 10,
        filter: (result: Result) => {
            const tenYearsAgo = new Date().getFullYear() - 10
            const publicationYear = getYearOfPublicationFromResult(result)
            const genreOrGenres = getGenreOrGenresFromResult(result)

            return publicationYear >= tenYearsAgo
                && !!getAuthorFromResult(result)
                && (genreOrGenres && !Array.isArray(genreOrGenres))
        },
    })
}

export const queryAll = async (): Promise<Result[]> => {
    const dutThrillers = await search('language:dut', [ 'type(book)', 'genre(thriller)' ])
    const dutHumors = await search('language:dut', [ 'type(book)', 'genre(humor)' ])
    const dutDetectives = await search('language:dut', [ 'type(book)', 'genre(detective)' ])
    const dutSports = await search('language:dut', [ 'type(book)', 'genre(sport)' ])
    const dutWonders = await search('language:dut', [ 'type(book)', 'genre(sprookjes)' ])
    const dutSchools = await search('language:dut', [ 'type(book)', 'genre(school)' ])
    const dutBiograpies = await search('language:dut', [ 'type(book)', 'genre(biografie)' ])
    // const engThrillers = await search('language:eng', [ 'type(book)', 'genre(thriller)' ])
    // const engHumors = await search('language:eng', [ 'type(book)', 'genre(humor)' ])
    // const engDetectives = await search('language:eng', [ 'type(book)', 'genre(detective)' ])
    // const engSports = await search('language:eng', [ 'type(book)', 'genre(sport)' ])
    // const engWonders = await search('language:eng', [ 'type(book)', 'genre(sprookjes)' ])
    // const engSchools = await search('language:eng', [ 'type(book)', 'genre(school)' ])
    // const engBiograpies = await search('language:eng', [ 'type(book)', 'genre(biografie)' ])
    // const gerThrillers = await search('language:ger', [ 'type(book)', 'genre(thriller)' ])
    // const gerHumors = await search('language:ger', [ 'type(book)', 'genre(humor)' ])
    // const gerDetectives = await search('language:ger', [ 'type(book)', 'genre(detective)' ])
    // const gerSports = await search('language:ger', [ 'type(book)', 'genre(sport)' ])
    // const gerWonders = await search('language:ger', [ 'type(book)', 'genre(sprookjes)' ])
    // const gerSchools = await search('language:ger', [ 'type(book)', 'genre(school)' ])
    // const gerBiograpies = await search('language:ger', [ 'type(book)', 'genre(biografie)' ])
    // const freThrillers = await search('language:fre', [ 'type(book)', 'genre(thriller)' ])
    // const freHumors = await search('language:fre', [ 'type(book)', 'genre(humor)' ])
    // const freDetectives = await search('language:fre', [ 'type(book)', 'genre(detective)' ])
    // const freSports = await search('language:fre', [ 'type(book)', 'genre(sport)' ])
    // const freWonders = await search('language:fre', [ 'type(book)', 'genre(sprookjes)' ])
    // const freSchools = await search('language:fre', [ 'type(book)', 'genre(school)' ])
    // const freBiograpies = await search('language:fre', [ 'type(book)', 'genre(biografie)' ])
    // const spaThrillers = await search('language:spa', [ 'type(book)', 'genre(thriller)' ])
    // const spaHumors = await search('language:spa', [ 'type(book)', 'genre(humor)' ])
    // const spaDetectives = await search('language:spa', [ 'type(book)', 'genre(detective)' ])
    // const spaSports = await search('language:spa', [ 'type(book)', 'genre(sport)' ])
    // const spaWonders = await search('language:spa', [ 'type(book)', 'genre(sprookjes)' ])
    // const spaSchools = await search('language:spa', [ 'type(book)', 'genre(school)' ])
    // const spaBiograpies = await search('language:spa', [ 'type(book)', 'genre(biografie)' ])

    return [
        ...dutThrillers,
        ...dutHumors,
        ...dutDetectives,
        ...dutSports,
        ...dutWonders,
        ...dutSchools,
        ...dutBiograpies,
        // ...engThrillers,
        // ...engHumors,
        // ...engDetectives,
        // ...engSports,
        // ...engWonders,
        // ...engSchools,
        // ...engBiograpies,
        // ...gerThrillers,
        // ...gerHumors,
        // ...gerDetectives,
        // ...gerSports,
        // ...gerWonders,
        // ...gerSchools,
        // ...gerBiograpies,
        // ...freThrillers,
        // ...freHumors,
        // ...freDetectives,
        // ...freSports,
        // ...freWonders,
        // ...freSchools,
        // ...freBiograpies,
        // ...spaThrillers,
        // ...spaHumors,
        // ...spaDetectives,
        // ...spaSports,
        // ...spaWonders,
        // ...spaSchools,
        // ...spaBiograpies,
    ]
}
