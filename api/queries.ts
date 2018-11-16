import * as fetch from 'node-fetch'

export const sendRequest = async location => {
    const data = await fetch(`https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&city=${location.key}&format=json`, {
        method: 'GET',
    })

    return data.json()
}
