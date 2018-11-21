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
    cityName: undefined,
    bookNames: [],
}

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 9,
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
        const minutesTranslation = fullMinutes === 1 ? 'minuut' : 'minuten'

        flyTimeWithUnits = `${Math.floor(hours)} uur en ${fullMinutes} ${minutesTranslation}`
    }

    return flyTimeWithUnits
}

const filterLinesByCityName = (cityName) => {
    const { lines } = geoJson

    return lines.features.filter(feature => {
        const transformedCityName = getTransformedCityName(feature.properties.fromCity)
        return transformedCityName === cityName
    })
}

const setNewListItem = (list, options) => {
    const { title, value, identifier } = options

    const item = document.createElement('li')
    const h3 = document.createElement('h3')

    item.appendChild(h3)
        .textContent = title

    const span = document.createElement('span')

    item.appendChild(span)
        .textContent = value

    item.id = identifier
    list.appendChild(item)
}

const updateExistingListItem = (options) => {
    const { value, identifier,  } = options

    if (Array.isArray(value)) {
        const booksListItem = document.getElementById('books')
        const dataList = booksListItem.parentElement
        booksListItem.innerHTML = ''

        const h3 = document.createElement('h3')
        const amountOfBooks = value.length

        booksListItem.appendChild(h3)
            .textContent = `Boek${amountOfBooks === 1 ? '' : 'en'} (${amountOfBooks})`

        value.map(v => {
            const span = document.createElement('span')

            booksListItem
                .appendChild(span)
                .textContent = v
        })

        booksListItem.classList.add('data-list')
        booksListItem.classList.add('data-list--multiple')

        dataList.appendChild(booksListItem)
    } else {
        const textElement = document.getElementById(identifier).querySelector('span')
        textElement.textContent = value
    }
}

const setSettings = () => {
    const { flySpeed, distanceBetweenCities, airplane, readableFlyTime, books } = interactionOptions
    const list = document.getElementById('settings-list')

    const roundFlySpeed = Math.floor(flySpeed)
    const roundDistance = Math.floor(distanceBetweenCities)
    const planePlaceholder = 'Selecteer een vliegtuig'
    const placeholderForInfoRequiringPlane = airplane ? 'Selecteer een locatie' : planePlaceholder

    const dataList = [
        {
            title: `Vliegtuig type`,
            value: airplane || planePlaceholder,
            identifier: 'plane-type'
        },
        {
            title: `Kruissnelheid`,
            value: roundFlySpeed ? `${roundFlySpeed}km/h` : placeholderForInfoRequiringPlane,
            identifier: 'plane-speed'
        },
        {
            title: `Afstand`,
            value: roundDistance ? `${roundDistance}km` : placeholderForInfoRequiringPlane,
            identifier: 'distance'
        },
        {
            title: `Geschatte vluchtduur`,
            value: readableFlyTime ? readableFlyTime : placeholderForInfoRequiringPlane,
            identifier: 'flight-duration'
        },
        {
            title: `Boeken`,
            value: books || 'Geen boeken gevonden',
            identifier: 'books'
        }
    ]

    if (!list.childNodes.length) {
        dataList.forEach(options => setNewListItem(list, options))
        return null
    }

    dataList.forEach(updateExistingListItem)
}
const toastError = (error) => {
    const tIn = d3.transition()
        .duration(300)
        .ease(d3.easeLinear)

    const tOut = d3.transition()
        .delay(2000)
        .duration(300)
        .ease(d3.easeLinear)

    d3.select('#error-toast')
        .text(error)
        .transition(tIn)
        .style('bottom', '0px')

    d3.select('#error-toast')
        .transition(tOut)
        .style('bottom', '-34px')
}

const setFlightTimeAndDistance = (cityName) => {
    const { flySpeed } = interactionOptions
    const lineByCityName = filterLinesByCityName(cityName)[0]
    const distanceBetweenCities = turf.lineDistance(lineByCityName)
    interactionOptions.distanceBetweenCities = distanceBetweenCities

    const flyTimeInMinutes = distanceBetweenCities / flySpeed * 60
    interactionOptions.flyTimeInMinutes = flyTimeInMinutes
    interactionOptions.readableFlyTime = getReadableFlyTime()
    interactionOptions.cityName = cityName
}

function handleCircleClick(d) {
    const { name: cityName, books } = d.properties
    const { flySpeed } = interactionOptions

    if (cityName === 'Amsterdam') {
        return null
    }

    if (!flySpeed) {
        const error = 'Please, select an airplane first'

        toastError(error)
        throw new Error(error)
    }

    interactionOptions.books = books

    const visibleLines = document.getElementsByClassName('line--visible')
    if (visibleLines.length > 0) {
        [...visibleLines].map(visibleLine => visibleLine.classList.remove('line--visible'))
    }

    const activeCities = document.getElementsByClassName('city--active')
    if (activeCities.length > 0) {
        [...activeCities].map(activeCity => activeCity.classList.remove('city--active'))
    }

    this.classList.add('city--active')

    const transformedCityName = getTransformedCityName(cityName)
    setD3LineClassName(transformedCityName)

    setFlightTimeAndDistance(transformedCityName)
    setSettings()
}

function handleOnSelectorChange({ target }) {
    const selectedOption = target.options[target.selectedIndex]
    const selectedPlane = selectedOption.text
    const { cityName } = interactionOptions

    interactionOptions.airplane = getCleanPlaneNameFromSelectedPlane(selectedPlane)
    interactionOptions.flySpeed = getSpeedFromSelectedPlane(selectedPlane)

    if (cityName) {
        const transformedCityName = getTransformedCityName(cityName)
        setFlightTimeAndDistance(transformedCityName)
    }

    setSettings()
}

const createArc = (d) => {
    // Heavily inspired by MapBox's (2018) example about animating a point along a route.
    const lineDistance = turf.lineDistance(d, 'kilometers')
    const arc = []

    const steps = 50

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(d, i, 'kilometers')
        arc.push(segment.geometry.coordinates)
    }

    d.geometry.coordinates = arc
    return path(d)
}

const setInitalLineClass = (d) => {
    return `line line--${d.properties.fromCity.toLowerCase().replace(' ', '_')}`
}

const drawLines = () => {
    const { lines } = geoJson

    svg.selectAll('path')
        .data(lines.features)
        .enter()
        .append('path')
            .attr('d', createArc)
            .attr('class', setInitalLineClass)

    triggerUpdate()
}

const drawCircles = () => {
    const { cities } = geoJson

    svg.selectAll('circle')
        .data(cities.features)
        .enter()
        .append('circle')
            .attr('r', 5)
            .attr('class', getCityStyleClassFromData)
            .on('click', handleCircleClick)

    drawLines()
}

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

const animateOnDataLoaded = () => {
    const t = d3.transition()
        .duration(600)
        .ease(d3.easeLinear)

    d3.select('body').transition(t)
        .style('opacity', '1')

    d3.select('.page-header').transition(t)
        .style('transform', 'translateY(0)')

    d3.select('aside').transition(t)
        .style('transform', 'translateX(0)')
}

map.on('load', async () => {
    try {
        geoJson.cities = await d3.json('../data/city.geo.json')
        geoJson.lines = await d3.json('../data/cityConnections.geo.json')

        animateOnDataLoaded()
        drawCircles()
    } catch (error) {
        toastError(error)
    }
})

window.addEventListener('load', (event) => {
    setupListeners()
    setSettings()
})