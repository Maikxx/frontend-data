import * as path from 'path'
import * as d3 from 'd3'
import * as fs from 'fs'
import * as flatten from 'lodash.flatten'
import { promisify } from 'util'
import { getTransformedDataFromResults, getMapLocations } from './getters'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const rawDataFile = path.join(__dirname, '/../data/rawData.json')
const dataFile = path.join(__dirname, '/../data/data.json')
const d3DataFile = path.join(__dirname, '/../data/d3Data.json')

const processRawData = async () => {
    const rawData = await readFile(rawDataFile)
    const rawDataResults = JSON.parse(rawData.toString())
    return rawDataResults.map(getTransformedDataFromResults)
}

const processDataWithD3 = async transformedData => {
    await writeFile(dataFile, JSON.stringify(transformedData))

    const citiesData = JSON.parse(transformedData.toString())
    return d3.nest()
        .key(d => d.locationName)
        .entries(citiesData)
}

export const preProcessData = async () => {
    const transformedData = await processRawData()
    const locations = await processDataWithD3(transformedData)

    const filteredLocations = flatten(await getMapLocations(locations))
        .filter(location => !location.error)
        .map(location => Array.isArray(location) && location[0] || location)

    writeFile(d3DataFile, JSON.stringify(filteredLocations))
}
