// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

// Development
import * as fs from 'fs'

import * as path from 'path'
const readStream = fs.createReadStream(`${path.join(__dirname, '/api/data')}/worldcitiespop.txt`, 'utf8')

// Server
import * as express from 'express'
const app = express()
const port = 3000

// Data
import { queryAll } from './api/queries'

import { getTransformedCityData, getPublicationLocationFromResults } from './api/getters'

; (async () => {
    try {
        const cityData = []
        readStream
            .on('data', chunk => {
                cityData.push(getTransformedCityData(chunk))
            })
            .on('end', async () => {
                // console.log(cityData)
            })

        const results = await queryAll()
        const publicationLocations = results.map(getPublicationLocationFromResults)
        console.log(publicationLocations)

        app.get('/', (req: Express.Request, res: any) => res.json(results))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

        if (process.env.NODE_ENV !== 'production') {
            fs.writeFile('data.json', JSON.stringify(results), err => err && console.error(err))
        }
    } catch (error) {
        console.error(error)

        if (process.env.NODE_ENV !== 'production') {
            fs.writeFile('search.error.json', error, null)
        }
    }
})()
