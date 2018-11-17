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

const rawDataFile = path.join(__dirname, '/../data/rawData.json')
const dataFile = path.join(__dirname, '/../data/data.json')
const cityDataFile = path.join(__dirname, '/../data/cityData.json')
const APILocationsFile = path.join(__dirname, '/../data/d3Data.json')

const processRawData = async () => {
    const rawData = await readFile(rawDataFile)
    const rawDataResults = JSON.parse(rawData.toString())
    return rawDataResults.map(getTransformedDataFromResults)
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

    await writeFile(cityDataFile, JSON.stringify(geoJson))
    return geoJson
}

export const preProcessData = async () => {
    const transformedData = await processRawData()
    const locations = await getLocations(transformedData)

    const filteredLocations = flatten(await getMapLocations(locations))
        .filter(location => !location.error)
        .map(location => Array.isArray(location) && location[0] || location)

    writeFile(APILocationsFile, JSON.stringify(filteredLocations))
}
