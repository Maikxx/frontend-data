export const getTransformedCityName = (cityName) => {
    return cityName
        .toLowerCase()
        .replace('\'', '')
        .replace(' ', '_')
}

export const getCityStyleClassFromData = (data) => {
    const { properties } = data
    const { name, dataClass } = properties

    return dataClass === 'main'
        ? `city city--${getTransformedCityName(name)} city--main`
        : `city city--${getTransformedCityName(name)}`
}