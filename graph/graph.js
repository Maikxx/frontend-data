// Projection //
mapboxgl.accessToken = 'pk.eyJ1IjoibWFpa3h4IiwiYSI6ImNqb2p0b2c1ZzA4NWIzdnBhNTJhMjk3MmIifQ.WWh5GShedNrj-2eYYnkXxw'

const geoJson = {
    lines: undefined,
    cities: undefined,
}

const interactionOptions = {
    flySpeed: undefined,
    airplane: undefined,
    distanceBetweenCities: undefined,
    flyTimeInMinutes: undefined,
    readableFlyTime: undefined,
}

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 11.5,
    center: [4.899431, 52.379189],
    doubleClickZoom: false,
})

const canvas = map.getCanvasContainer()
const svg = d3.select(canvas).append('svg')
const project = d => map.project(new mapboxgl.LngLat(+d[0], +d[1]))

function projectPoint (lon, lat) {
    const point = map.project(new mapboxgl.LngLat(lon, lat))
    this.stream.point(point.x, point.y)
}

const transform = d3.geoTransform({ point: projectPoint })
const path = d3.geoPath().projection(transform)

// Updaters //
const updateCities = (transitionTime) => {
    svg.selectAll('.city')
    .transition()
    .duration(transitionTime)
        .attr('cx', d => project(d.geometry.coordinates).x )
        .attr('cy', d => project(d.geometry.coordinates).y )
}

const updateLines = (transitionTime) => {
    svg.selectAll('path')
    .transition()
    .duration(transitionTime)
        .attr('d', path)
}

const update = (transitionTime = 5) => {
    updateCities(transitionTime)
    updateLines(transitionTime)
}

const triggerUpdate = () => {
    update()

    map.on('viewreset', update)
    map.on('move', update)
    map.on('moveend', update)
}

// Getters //
const getCityStyleClassFromData = (data) => {
    return data.properties.dataClass === 'main'
        ? 'city city--main'
        : 'city'
}

const getTransformedCityName = (cityName) => {
    return cityName
        .toLowerCase()
        .replace(' ', '_')
}

const getSpeedFromSelectedPlane = (text) => {
    const cleanedText = text
        .split('(')[1]
        .split('km/h')[0]
        .trim()

    return Number(cleanedText)
}

const getCleanPlaneNameFromSelectedPlane = (text) => {
    return text
        .split('(')[0]
        .trim()
}

const getReadableFlyTime = () => {
    const { flyTimeInMinutes } = interactionOptions
    let flyTimeWithUnits

    if (flyTimeInMinutes <= 2) {
        const seconds = Math.floor(flyTimeInMinutes * 60)
        const secondsTranslation = seconds === 1 ? 'seconde' : 'secondes'

        flyTimeWithUnits = `${seconds} ${secondsTranslation}`
    }

    if (flyTimeInMinutes > 2 && flyTimeInMinutes <= 60) {
        const fullMinutes = Math.floor(flyTimeInMinutes)
        const seconds = Math.floor(Number('0.' + flyTimeInMinutes.toString().split('.')[1]) * 60)
        const minutesTranslation = fullMinutes === 1 ? 'minuut' : 'minuten'
        const secondsTranslation = seconds === 1 ? 'seconde' : 'secondes'

        flyTimeWithUnits = `${fullMinutes} ${minutesTranslation} en ${seconds} ${secondsTranslation}`
    }

    if (flyTimeInMinutes > 60) {
        const hours = flyTimeInMinutes / 60
        const fullMinutes = Math.floor(Number('0.' + hours.toString().split('.')[1]) * 60)
        const hoursTranslation = hours === 1 ? 'uur' : 'uren'
        const minutesTranslation = fullMinutes === 1 ? 'minuut' : 'minuten'

        flyTimeWithUnits = `${Math.floor(hours)} ${hoursTranslation} en ${fullMinutes} ${minutesTranslation}`
    }

    return flyTimeWithUnits
}

// Filters //
const filterLinesByCityName = (cityName) => {
    const { lines } = geoJson

    return lines.features.filter(feature => {
        const transformedCityName = getTransformedCityName(feature.properties.fromCity)
        return transformedCityName === cityName
    })
}

// Data Display
const setNewListItem = (list, textContent) => {
    const { title, value } = textContent

    const item = document.createElement('li')
    const h3 = document.createElement('h3')
    const span = document.createElement('span')

    item.appendChild(h3)
        .textContent = `${title}: `

    item.appendChild(span)
        .textContent = value

    list.appendChild(item)
}

const setSettings = () => {
    const { flySpeed, distanceBetweenCities, airplane, readableFlyTime } = interactionOptions
    const list = document.getElementById('settings-list')
    const children = list.childNodes

    if (children) {
        list.innerHTML = ''
    }

    const roundFlySpeed = Math.floor(flySpeed)
    const roundDistance = Math.floor(distanceBetweenCities)
    const planePlaceholder = 'Selecteer een vliegtuig'
    const placeholderForInfoRequiringPlane = airplane ? 'Selecteer een locatie' : planePlaceholder

    setNewListItem(list, {title: `Vliegtuig type`, value: airplane || planePlaceholder})
    setNewListItem(list, {title: `Kruissnelheid`, value: roundFlySpeed ? `${roundFlySpeed}km/h` : placeholderForInfoRequiringPlane})
    setNewListItem(list, {title: `Astand`, value: roundDistance ? `${roundDistance}km` : placeholderForInfoRequiringPlane})
    setNewListItem(list, {title: `Geschatte vluchtduur`, value: readableFlyTime ? readableFlyTime : placeholderForInfoRequiringPlane})
}

// Handlers //
function handleCircleClick(d) {
    const { name: cityName } = d.properties
    const { flySpeed } = interactionOptions

    if (cityName === 'Amsterdam') {
        return null
    }

    if (!flySpeed) {
        throw new Error('Please, select an airplane first')
    }

    const transformedCityName = getTransformedCityName(cityName)
    setD3LineClassName(transformedCityName)

    if (this.classList.contains('city--active')) {
        this.classList.remove('city--active')

        // Breaking out of the function to stop the setting of a flySpeed
        return null
    } else {
        this.classList.add('city--active')
    }

    const lineByCityName = filterLinesByCityName(transformedCityName)[0]
    const distanceBetweenCities = turf.lineDistance(lineByCityName)
    interactionOptions.distanceBetweenCities = distanceBetweenCities

    const flyTimeInMinutes = distanceBetweenCities / flySpeed * 60
    interactionOptions.flyTimeInMinutes = flyTimeInMinutes
    interactionOptions.readableFlyTime = getReadableFlyTime()

    setSettings()
}

function handleOnSelectorChange({ target }) {
    const selectedOption = target.options[target.selectedIndex]
    const selectedPlane = selectedOption.text

    interactionOptions.airplane = getCleanPlaneNameFromSelectedPlane(selectedPlane)
    interactionOptions.flySpeed = getSpeedFromSelectedPlane(selectedPlane)
}

// Drawers //
const drawLines = () => {
    const { lines } = geoJson

    svg.selectAll('path')
        .data(lines.features)
        .enter()
        .append('path')
            .attr('d', path)
            .attr('class', d => `line line--${d.properties.fromCity.toLowerCase().replace(' ', '_')}`)

    triggerUpdate()
}

const drawCircles = () => {
    const { cities } = geoJson

    svg.selectAll('circle')
        .data(cities.features)
        .enter()
        .append('circle')
            .attr('r', 8)
            .attr('class', getCityStyleClassFromData)
            .on('click', handleCircleClick)

    drawLines()
}

// Setters //
const setD3LineClassName = (cityName) => {
    const className = `line--${cityName}`
    const shouldLineBeShown = d3.select(`.${className}`).classed('line--visible')
        ? false
        : true

    d3.select(`.${className}`)
        .classed('line--visible', shouldLineBeShown)
}

const setupListeners = () => {
    const selectionElement = document.getElementById('select-plane')
    selectionElement.addEventListener('change', handleOnSelectorChange)
}

// Initializer //
map.on('load', async () => {
    geoJson.cities = await d3.json('//api.jsonbin.io/b/5bf00a8518a56238b6f7c928/4')
    geoJson.lines = await d3.json('//api.jsonbin.io/b/5bf149b973474c2f8d97dcce')

    drawCircles()
})

window.addEventListener('load', (event) => {
    setupListeners()
    setSettings()
})