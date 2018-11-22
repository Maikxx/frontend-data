import { state } from '../client'

export const getSpeedFromSelectedPlane = (text) => {
    const cleanedText = text
        .split('(')[1]
        .split('km/h')[0]
        .trim()

    return Number(cleanedText)
}

export const getCleanPlaneNameFromSelectedPlane = (text) => {
    return text
        .split('(')[0]
        .trim()
}

export const getReadableFlyTime = () => {
    const { flyTimeInMinutes } = state.interactionOptions
    let flyTimeWithUnits

    if (flyTimeInMinutes <= 2) {
        const seconds = Math.floor(flyTimeInMinutes * 60)
        const secondsTranslation = seconds === 1
            ? 'seconde'
            : 'secondes'

        flyTimeWithUnits = `${seconds} ${secondsTranslation}`
    }

    if (flyTimeInMinutes > 2 && flyTimeInMinutes <= 60) {
        const fullMinutes = Math.floor(flyTimeInMinutes)
        const seconds = Math.floor(Number('0.' + flyTimeInMinutes.toString().split('.')[1]) * 60)

        const minutesTranslation = fullMinutes === 1
            ? 'minuut'
            : 'minuten'

        const secondsTranslation = seconds === 1
            ? 'seconde'
            : 'secondes'

        flyTimeWithUnits = `${fullMinutes} ${minutesTranslation} en ${seconds} ${secondsTranslation}`
    }

    if (flyTimeInMinutes > 60) {
        const hours = flyTimeInMinutes / 60
        const fullMinutes = Math.floor(Number('0.' + hours.toString().split('.')[1]) * 60)
        const minutesTranslation = fullMinutes === 1
            ? 'minuut'
            : 'minuten'

        flyTimeWithUnits = `${Math.floor(hours)} uur en ${fullMinutes} ${minutesTranslation}`
    }

    return flyTimeWithUnits
}

export const fetchWindSpeed = async () => {
    const { fromCityCoordinates } = state.interactionOptions

    if (!fromCityCoordinates.length) {
        return null
    }

    const [ lon, lat ] = fromCityCoordinates
    const url = `https://api.darksky.net/forecast/5b3678e68ed7fd50f15f7acf20625ff6/${lat},${lon}`
    const data = await fetch(url, {method: 'GET'})
    const parsed = await data.json()

    return parsed
}

export const getWindSpeedAndBearing = async () => {
    const weatherForLocation = await fetchWindSpeed()
    const currentWeather = weatherForLocation && weatherForLocation.currently
    const windSpeedInMph = currentWeather && currentWeather.windSpeed
    const windBearing = currentWeather && currentWeather.windBearing
    const windSpeedInKmh = windSpeedInMph && windSpeedInMph * 1.609344

    return {
        windBearing,
        windSpeedInKmh,
    }
}

export const getWeatherImpactOnFlySpeed = async () => {
    const AMSTERDAM_LONGITUDE = 4.8951679
    const { flySpeed, fromCityCoordinates } = state.interactionOptions
    const [ fromCityLongitude ] = fromCityCoordinates

    const { windBearing, windSpeedInKmh } = await getWindSpeedAndBearing()

    if (!windBearing) {
        return flySpeed
    }

    let processedFlightSpeed = flySpeed

    if (windBearing >= 0 && windBearing <= 180) {
        if (fromCityLongitude > AMSTERDAM_LONGITUDE) {
            processedFlightSpeed = flySpeed + windSpeedInKmh
        } else {
            processedFlightSpeed = flySpeed - windSpeedInKmh
        }
    } else {
        if (fromCityLongitude > AMSTERDAM_LONGITUDE) {
            processedFlightSpeed = flySpeed - windSpeedInKmh
        } else {
            processedFlightSpeed = flySpeed + windSpeedInKmh
        }
    }

    return processedFlightSpeed
}