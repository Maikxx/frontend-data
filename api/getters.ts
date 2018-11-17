// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

import * as chunk from 'lodash.chunk'
import { sendRequest } from './queries'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { nestDataByLocation } from './processors'
const dataFile = path.join(__dirname, '/../data/data.json')
const writeFile = promisify(fs.writeFile)

const getCleanPublicationLocation = (publicationLocation: string) => {
    return publicationLocation
        .replace(/\[|\]/g, '')
        .replace('etc.', '')
        .trim()
}

export const getTransformedDataFromResults = (result?: any) => {
    const cleanPublicationLocation = result.publication
        && result.publication.place
        && getCleanPublicationLocation(result.publication.place)

    const shortTitle = result.title && result.title.short
    const publicationYear = result.publication && result.publication.year && Number(result.publication.year)

    return {
        locationName: cleanPublicationLocation,
        lat: undefined,
        long: undefined,
        book: shortTitle,
        publicationYear,
    }
}

export const getMapLocations = async locations => {
    const returnable = []

    const chunked = chunk(locations, 1)

    for (const chunk of chunked) {
        const request = chunk.map(sendRequest)
        returnable.push(await Promise.all(request))
        console.log(returnable)
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return returnable
}

export const getLocations = async transformedData => {
    await writeFile(dataFile, JSON.stringify(transformedData))

    const citiesData = JSON.parse(transformedData.toString())
    return nestDataByLocation(citiesData)
}

export const getGeometryDatafromApiLocation = apiLocation => ({
    geometry: {
        type: 'Point',
        coordinates: [
            apiLocation.lon,
            apiLocation.lat,
        ],
    },
})
