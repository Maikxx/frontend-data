import * as fetch from 'node-fetch'
import { BooksByLocation } from './types/Book'
import { LocationIQPlace } from './types/Location'

export const sendRequest = async (location: BooksByLocation): Promise<LocationIQPlace> => {
    // tslint:disable-next-line:ter-max-len
    const url = `https://cors-anywhere.herokuapp.com/https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&city=${location.key}&format=json`
    const options = { method: 'GET' }

    const data = await fetch(url, options)

    return data.json()
}
