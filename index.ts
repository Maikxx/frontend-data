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
import { search } from './api/queries'

; (async () => {
    try {
        const results = await search(`language:dut`, ['type(book)'], 100)

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
