// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

// Server
import * as express from 'express'
import { getGeoLocationsFromBooks } from './api/processors'
const app = express()
const port = 3000

; (async () => {
    try {
        const transformedData = await getGeoLocationsFromBooks()

        app.get('/', (req: Express.Request, res: any) => res.json(transformedData))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

    } catch (error) {
        console.error(error)
    }
})()
