import * as path from 'path'
import * as d3 from 'd3'
import * as fs from 'fs'
import flatten = require('lodash.flatten')
import { promisify } from 'util'
import {
    getTransformedDataFromResults,
    getLocationIQPlaces,
    getGeometryDatafromApiLocation,
    getLocations,
    getTransformedLocationNameForAPI,
    getDataClassForLocation
} from './getters'
import { TransformedBook, BooksByLocation, Book } from './types/Book'
import { filterApiLocationByLocationName } from './filters'
import { GeoLocationCollection, GeoLocationFeature } from './types/Location'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const obaApiDataFile = path.join(__dirname, '/../data/oba.data.json')
const dataFile = path.join(__dirname, '/../data/transformed.data.json')
const cityGeoFile = path.join(__dirname, '/../data/city.geo.json')
// const cityConnectionsFile = path.join(__dirname, '/../data/cityConnections.json')
const APILocationsFile = path.join(__dirname, '/../data/locations.api.json')

const processobaApiData = async (): Promise<Book[]> => {
    const obaApiData = await readFile(obaApiDataFile)
    const obaApiDataResults = JSON.parse(obaApiData.toString())

    return obaApiDataResults.map(getTransformedDataFromResults)
}

export const nestBooksByLocation = (transformedCities: TransformedBook[]): BooksByLocation[] => {
    return d3.nest()
        .key((TransformedBook: TransformedBook) => getTransformedLocationNameForAPI(TransformedBook.locationName))
        .entries(transformedCities)
        .map((booksByLocation: BooksByLocation) => ({
            ...booksByLocation,
            values: booksByLocation.values.filter(book => book.locationName),
        }))
}

export const getGeoLocationsFromBooks = async (): Promise<GeoLocationCollection> => {
    const data = await readFile(dataFile)
    const citiesData = JSON.parse(data.toString())

    const booksByLocation = nestBooksByLocation(citiesData)

    const apiLocationsData = await readFile(APILocationsFile)
    const apiLocations = JSON.parse(apiLocationsData.toString())

    const geoJson = {
        type: 'FeatureCollection',
        features: await booksByLocation
            .map(bookByLocation => {
                const { key: location } = bookByLocation

                return {
                    type: 'Feature',
                    properties: {
                        name: location,
                        dataClass: getDataClassForLocation(location),
                        books: bookByLocation.values.map(value => value.book),
                    },
                    ...apiLocations
                        .filter(apiLocation => filterApiLocationByLocationName(apiLocation, location))
                        .map(getGeometryDatafromApiLocation)[0],
                }
            })
            .filter((geoLocationFeature: GeoLocationFeature) => geoLocationFeature.geometry),
    }

    await writeFile(cityGeoFile, JSON.stringify(geoJson))
    return geoJson
}

export const preProcessData = async (): Promise<void> => {
    const transformedData = await processobaApiData()
    const locations = await getLocations(transformedData)

    const filteredLocations = flatten(await getLocationIQPlaces(locations))
        .filter(location => !location.error)
        .map(location => Array.isArray(location) && location[0] || location)

    writeFile(APILocationsFile, JSON.stringify(filteredLocations))
}

// export const connectCities = () => {
//     const connections = {
//         type: 'FeatureCollection',
//         features: [

//         ],
//     }
// }
