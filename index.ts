// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

// Server
import * as express from 'express'
import { getGeoLocationsFromBooks, getCityGeoConnections } from './api/processors'
const app = express()
const port = 3000

; (async () => {
    try {
        const cityGeoLocations = await getGeoLocationsFromBooks()
        const cityGeoConnections = await getCityGeoConnections(cityGeoLocations)
        console.dir(cityGeoConnections, { depth: null })

        app.get('/', (req: Express.Request, res: any) => res.json(cityGeoLocations))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

    } catch (error) {
        console.error(error)
    }
})()
