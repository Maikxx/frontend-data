import * as path from 'path'
import * as d3 from 'd3'
import * as fs from 'fs'
import * as flatten from 'lodash.flatten'
import { promisify } from 'util'
import {
    getTransformedDataFromResults,
    getMapLocations,
    getGeometryDatafromApiLocation,
    getLocations,
    getTransformedLocationNameForAPI
} from './getters'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const obaApiDataFile = path.join(__dirname, '/../data/oba.data.json')
const dataFile = path.join(__dirname, '/../data/transformed.data.json')
const cityGeoFile = path.join(__dirname, '/../data/city.geo.json')
const cityConnectionsFile = path.join(__dirname, '/../data/cityConnections.json')
const APILocationsFile = path.join(__dirname, '/../data/locations.api.json')

const processobaApiData = async () => {
    const obaApiData = await readFile(obaApiDataFile)
    const obaApiDataResults = JSON.parse(obaApiData.toString())
    return obaApiDataResults.map(getTransformedDataFromResults)
}

export const nestDataByLocation = data => {
    return d3.nest()
        .key(d => getTransformedLocationNameForAPI(d.locationName))
        .entries(data)
        .map(d => ({
            ...d,
            values: d.values.filter(dv => dv.locationName),
        }))
}

const filterApiLocationByLocationName = (apiLocation, locationName: string) => {
    const displayName = apiLocation && apiLocation.display_name

    if (!displayName || !locationName || locationName === 'undefined' || locationName === 'UK') {
        return
    }

    const apiLocationName = displayName.toLowerCase()
    const nestedLocationName = locationName.toLowerCase()

    return apiLocationName.includes(nestedLocationName)
}

export const processDataWithD3 = async () => {
    const data = await readFile(dataFile)
    const citiesData = JSON.parse(data.toString())

    const nestedLocations = nestDataByLocation(citiesData)

    const apiLocationsData = await readFile(APILocationsFile)
    const apiLocations = JSON.parse(apiLocationsData.toString())

    const geoJson = {
        type: 'FeatureCollection',
        features: await nestedLocations
            .map(nestedLocation => {
                const { key: locationName } = nestedLocation
                const dataClass = locationName === 'Amsterdam'
                    ? 'main'
                    : 'normal'

                return {
                    type: 'Feature',
                    properties: {
                        name: locationName,
                        dataClass,
                        books: nestedLocation.values.map(nlv => nlv.book),
                    },
                    ...apiLocations
                        .filter(apiLocation => {
                            return filterApiLocationByLocationName(apiLocation, locationName)
                        })
                        .map(getGeometryDatafromApiLocation)[0],
                }
            })
            .filter(geoJsonLocation => geoJsonLocation.geometry),
    }

    await writeFile(cityGeoFile, JSON.stringify(geoJson))
    return geoJson
}

export const preProcessData = async () => {
    const transformedData = await processobaApiData()
    const locations = await getLocations(transformedData)

    const filteredLocations = flatten(await getMapLocations(locations))
        .filter(location => !location.error)
        .map(location => Array.isArray(location) && location[0] || location)

    writeFile(APILocationsFile, JSON.stringify(filteredLocations))
}

export const connectCities = () => {
    const connections = {
        type: 'FeatureCollection',
        features: [

        ],
    }
}
