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

// Data
import { queryAll } from './api/queries'
import { getDataStructureFromResults } from './api/getters'

; (async () => {
    try {
        const results = await queryAll()
        const dataStructure = getDataStructureFromResults(results)

        app.get('/', (req: Express.Request, res: any) => res.json(dataStructure))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

        if (process.env.NODE_ENV !== 'production') {
            fs.writeFile('data.json', JSON.stringify(dataStructure), err => err && console.error(err))
        }
    } catch (error) {
        console.error(error)

        if (process.env.NODE_ENV !== 'production') {
            fs.writeFile('search.error.json', error, null)
        }
    }
})()
