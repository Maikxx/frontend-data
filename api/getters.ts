// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

import chunk = require('lodash.chunk')
import { sendRequest } from './queries'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { nestBooksByLocation } from './processors'
import { LocationIQPlace, GeoLocationFeatureGeometry, GeoLocationFeature } from './types/Location'
import { Book, BooksByLocation } from './types/Book'
import { Result } from './types/Result'
const dataFile = path.join(__dirname, '/../data/transformed.data.json')
const writeFile = promisify(fs.writeFile)

// tslint:disable-next-line:cyclomatic-complexity
export const getTransformedLocationNameForAPI = (locationName?: string): string => {
    const name = locationName && locationName.toLowerCase()

    if (!name) {
        return undefined
    }

    if (name === 'moskva') {
        return 'Moscow'
    }

    if (name === 'edinburgh gate, harlow') {
        return 'Harlow'
    }

    if (name.includes(',') || name.includes(':')) {
        return name.split(/\,|\:/g)[0]
    }

    if (name === 'frankfurt am main' || name === 'frankfurt a. m.' || name === 'frankfurt a.m.') {
        return 'Frankfurt'
    }

    if (name === 'grand duché de luxembourg') {
        return 'Luxembourg'
    }

    if (name === 'amsterdam etc') {
        return 'Amsterdam'
    }

    if (name.includes(' i.e. ')) {
        return name.split(' i.e. ')[1]
    }

    if (name === 'alphen a/d rijn') {
        return 'Alphen aan den rijn'
    }

    if (name === 'capelle a/d ijssel') {
        return 'Capelle aan de ijssel'
    }

    if (name === 'nieuwerkerk a/d ijssel') {
        return 'Nieuwerkerk aan den ijssel'
    }

    if (name === 'paris 6e') {
        return 'Paris'
    }

    if (name === 'nieuw vennep') {
        return 'Nieuw-Vennep'
    }

    if (name === 'london  simon & schuster' || name === 'londen') {
        return 'London'
    }

    if (name === 'nðmegen') {
        return 'Nijmegen'
    }

    if (name === 'bagd¯ad') {
        return 'Bagdad'
    }

    return locationName
}

const getCleanPublicationLocation = (publicationLocation: string): string => {
    return publicationLocation
        .replace(/\[|\]/g, '')
        .replace('etc.', '')
        .trim()
}

export const getTransformedDataFromResults = (result?: Result): Book => {
    const cleanPublicationLocation = result.publication
        && result.publication.place
        && getCleanPublicationLocation(result.publication.place)

    const shortTitle = result.title && result.title.short
    const publicationYear = result.publication && result.publication.year && Number(result.publication.year)

    return {
        locationName: cleanPublicationLocation,
        book: shortTitle,
        publicationYear,
    }
}

export const getLocationIQPlaces = async (booksByLocations: BooksByLocation[]): Promise<LocationIQPlace[]> => {
    const returnable = []

    const chunked = chunk(booksByLocations, 1)

    for (const chunk of chunked) {
        const request = chunk.map(sendRequest)
        returnable.push(await Promise.all(request))

        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return returnable
}

export const getLocations = async (books: Book[]): Promise<BooksByLocation[]> => {
    await writeFile(dataFile, JSON.stringify(books))

    const citiesData = JSON.parse(books.toString())
    return nestBooksByLocation(citiesData)
}

export const getGeometryDatafromApiLocation = (apiLocation: LocationIQPlace): GeoLocationFeatureGeometry => ({
    geometry: {
        type: 'Point',
        coordinates: [
            apiLocation.lon,
            apiLocation.lat,
        ],
    },
})

export const getDataClassForLocation = (location?: string): string => {
    return location === 'Amsterdam'
        ? 'main'
        : 'normal'
}

// Tucker, T. (2013, September 4). [Center point of two coordinate arrays] [Code].
// Retrieved November 18, 2018, from https://stackoverflow.com/a/30033564
const rad2degr = (rad: number) => {
    return rad * 180 / Math.PI
}
const degr2rad = (degr: number) => {
    return degr * Math.PI / 180
}

const getLatLngCenter = (latLngInDegr: number[][]) => {
    const LNGIDX = 0
    const LATIDX = 1
    let sumX = 0
    let sumY = 0
    let sumZ = 0

    for (let i = 0; i < latLngInDegr.length; i++) {
        const lng = degr2rad(latLngInDegr[i][LNGIDX])
        const lat = degr2rad(latLngInDegr[i][LATIDX])

        // Sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng)
        sumY += Math.cos(lat) * Math.sin(lng)
        sumZ += Math.sin(lat)
    }

    const avgX = sumX / latLngInDegr.length
    const avgY = sumY / latLngInDegr.length
    const avgZ = sumZ / latLngInDegr.length

    // Convert average x, y, z coordinate to latitude and longtitude
    const lng = Math.atan2(avgY, avgX)
    const hyp = Math.sqrt(avgX * avgX + avgY * avgY)
    const lat = Math.atan2(avgZ, hyp)

    return ([ rad2degr(lng), rad2degr(lat) ])
}

const getNumberValuesForCoordinates = (coordinates: string[]) => {
    return coordinates.map((coordinate: string) => Number(coordinate))
}

const getIntermediateCoordinates = (fromCityCoordinates: string[], toCityCoordinates: string[]) => {
    const numberValuesForCoordinates = [ getNumberValuesForCoordinates(fromCityCoordinates), getNumberValuesForCoordinates(toCityCoordinates) ]
    const centerCoordinates = getLatLngCenter(numberValuesForCoordinates)
    const [ centerCoordinateLon, centerCoordinateLat ] = centerCoordinates
    const centerCoordinatesWithCurve = [ (centerCoordinateLon + 1).toString(), centerCoordinateLat.toString() ]

    return centerCoordinatesWithCurve
}

export const getGeometryForConnections = (cityGeoLocationFeature: GeoLocationFeature) => {
    const AMSTERDAM_COORDINATES = [ '4.89797550561798', '52.3745403' ]
    const { geometry: { coordinates: toCityCoordinates }} = cityGeoLocationFeature

    return {
        type: 'LineString',
        coordinates: [
            toCityCoordinates,
            getIntermediateCoordinates(AMSTERDAM_COORDINATES, toCityCoordinates),
            AMSTERDAM_COORDINATES,
        ],
    }
}
