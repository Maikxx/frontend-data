// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

// Development
import * as fs from 'fs'

// Server
import * as express from 'express'
const app = express()
const port = 3000

import { getTransformedDataFromResults } from './api/getters'

; (async () => {
    try {
        fs.readFile(`${__dirname}/data/rawData.json`, (err, data) => {
            const results = JSON.parse(data.toString())
            const transformedData = results.map(getTransformedDataFromResults)

            app.get('/', (req: Express.Request, res: any) => res.json(transformedData))
            app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

            if (process.env.NODE_ENV !== 'production') {
                fs.writeFile('data/data.json', JSON.stringify(transformedData), err => err && console.error(err))
            }
        })

    } catch (error) {
        console.error(error)

        if (process.env.NODE_ENV !== 'production') {
            fs.writeFile('search.error.json', error, null)
        }
    }
})()
