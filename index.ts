// Immediately load the dotenv file if the environment is not production.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

import * as fs from 'fs'
import { promisify } from 'util'
import * as path from 'path'
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const d3DataFile = path.join(__dirname, '/data/d3Data.json')

// Server
import * as express from 'express'
const app = express()
const port = 3000

// import { preProcessData } from './api/processors'

; (async () => {
    try {
        // const transformedData = await preProcessData()
        const d3Data = await readFile(d3DataFile)
        const d = await JSON.parse(d3Data.toString())
        const td = d.map(dd => Array.isArray(dd) && dd[0] || dd)
        await writeFile(d3DataFile, JSON.stringify(td))
        // console.dir(td, { depth: null })

        // app.get('/', (req: Express.Request, res: any) => res.json(transformedData))
        app.get('/', (req: Express.Request, res: any) => res.json({}))
        app.listen(port, () => console.log(`\nAvailable on: localhost:${port}`))

    } catch (error) {
        console.error(error)
    }
})()
