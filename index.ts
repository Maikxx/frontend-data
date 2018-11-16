// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

import * as d3 from 'd3'
import * as fetch from 'node-fetch'
import * as fs from 'fs'
import * as flatten from 'lodash.flatten'
import * as chunk from 'lodash.chunk'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Server
import * as express from 'express'
const app = express()
const port = 3000

import { getTransformedDataFromResults } from './api/getters'

const sendRequest = async location => {
    const data = await fetch(`https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&city=${location.key}&format=json`, {
        method: 'GET',
    })

    return data.json()
}

const getMapLocations = async locations => {
    const returnable = []

    const chunked = chunk(locations, 1)

    for (const chunk of chunked) {
        const request = chunk.map(sendRequest)
        returnable.push(await Promise.all(request))
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(returnable)
    }

    return returnable
}

; (async () => {
    try {
        const rawData = await readFile(`${__dirname}/data/rawData.json`)
        const rawDataResults = JSON.parse(rawData.toString())
        const transformedData = rawDataResults.map(getTransformedDataFromResults)

        await writeFile('data/data.json', JSON.stringify(transformedData))

        const transformedLoadedData = await readFile(`${__dirname}/data/data.json`)
        const citiesData = JSON.parse(transformedLoadedData.toString())
        const unknownCities = ['Dimasq']
        const locations = d3.nest()
            .key(d => d.locationName)
            .entries(citiesData)
            .filter(d => !unknownCities.includes(d.key))

        console.dir(locations, { depth: null })

        // const locationsToSearchFor = await flatten(getMapLocations(locations))

        app.get('/', (req: Express.Request, res: any) => res.json(transformedData))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

    } catch (error) {
        console.error(error)

        if (process.env.NODE_ENV !== 'production') {
            fs.writeFile('search.error.json', error, null)
        }
    }
})()
