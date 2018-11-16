// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

import * as fs from 'fs'

// Server
import * as express from 'express'
const app = express()
const port = 3000

import { preProcessData } from './api/processors'

; (async () => {
    try {
        const transformedData = await preProcessData()

        app.get('/', (req: Express.Request, res: any) => res.json(transformedData))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

    } catch (error) {
        console.error(error)
    }
})()
