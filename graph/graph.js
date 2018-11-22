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

const getMinAmountOfBooks = () => {
    return d3.min(geoJson.cities.features, f => f.properties.books.length)
}

const getMaxAmountOfBooks = () => {
    return d3.max(geoJson.cities.features, f => f.properties.books.length)
}

const getNormalColorScale = () => {
    return d3.scaleLog()
        .base(30)
        .domain([getMinAmountOfBooks(), getMaxAmountOfBooks()])
        .range(['#66FCF1', '#2F2FA2'])
}

const getHoverColorScale = () => {
    return d3.scaleLog()
        .base(30)
        .domain([getMinAmountOfBooks(), getMaxAmountOfBooks()])
        .range(['#0ffae9', '#232379'])
}

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

const getTransformedCityName = (cityName) => {
    return cityName
        .toLowerCase()
        .replace('\'', '')
        .replace(' ', '_')
}

const getCityStyleClassFromData = (data) => {
    return data.properties.dataClass === 'main'
        ? `city city--${getTransformedCityName(data.properties.name)} city--main`
        : `city city--${getTransformedCityName(data.properties.name)}`
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

const setNewUISelectionListItem = (list, options) => {
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

const updateExistingUISelectionListItem = (options) => {
    const { value, identifier,  } = options

    if (Array.isArray(value)) {
        const booksListItem = document.getElementById('books')
        const dataList = booksListItem.parentElement
        booksListItem.innerHTML = ''

        const h3 = document.createElement('h3')
        const amountOfBooks = value.length

        booksListItem.appendChild(h3)
            .textContent = `Boek${amountOfBooks === 1 ? '' : 'en'} (${amountOfBooks})`

        value
            .sort((a, b) => a > b ? 1 : -1)
            .map(v => {
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

const setUISelectionSettings = () => {
    const { flySpeed, distanceBetweenCities, airplane, readableFlyTime, books } = interactionOptions
    const list = document.getElementById('settings-list')

    const roundFlySpeed = Math.floor(flySpeed)
    const roundDistance = Math.floor(distanceBetweenCities)
    const planePlaceholder = 'Selecteer een vliegtuig'
    const placeholderForInfoRequiringPlane = airplane ? 'Selecteer een locatie' : planePlaceholder

    const dataOptions = [
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
            value: readableFlyTime || placeholderForInfoRequiringPlane,
            identifier: 'flight-duration'
        },
        {
            title: `Boeken`,
            value: books || 'Geen boeken gevonden',
            identifier: 'books'
        }
    ]

    if (!list.childNodes.length) {
        dataOptions.forEach(options => setNewUISelectionListItem(list, options))
        return null
    }

    dataOptions.forEach(updateExistingUISelectionListItem)
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

    throw new Error(error)
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
    }

    interactionOptions.books = books

    d3.selectAll('.line')
        .style('stroke-width', '0')

    d3.selectAll('.city')
        .style('stroke-width', 5)

    d3.select(this)
        .style('stroke-width', 10)

    const transformedCityName = getTransformedCityName(cityName)
    setLineToActive(transformedCityName)

    setFlightTimeAndDistance(transformedCityName)
    setUISelectionSettings()
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

    setUISelectionSettings()
}

const createArc = (d) => {
    // Heavily inspired by MapBox's (2018) example about animating a point along a route.
    const lineDistance = turf.lineDistance(d, 'kilometers')
    const arc = []

    const steps = 40

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(d, i, 'kilometers')
        arc.push(segment.geometry.coordinates)
    }

    d.geometry.coordinates = arc
    return path(d)
}

const drawLines = () => {
    const { lines } = geoJson
    const normalColorScale = getNormalColorScale()

    svg.selectAll('path')
        .data(lines.features)
        .enter()
        .append('path')
            .attr('d', createArc)
            .attr('class', d => `line line--${getTransformedCityName(d.properties.fromCity)}`)
            .style('stroke', d => {
                const { cities } = geoJson
                const { features } = cities
                const cityName = d.properties.fromCity
                const filteredCity = features.filter(feature => feature.properties.name === cityName)[0]
                const { books } = filteredCity.properties
                const amountOfBooks = books.length

                return normalColorScale(amountOfBooks)
            })

    triggerUpdate()
}

const getNormalFillOrStrokeColor = (d) => {
    const normalColorScale = getNormalColorScale()
    return d.properties.name !== 'Amsterdam' && normalColorScale(d.properties.books.length)
}

const getHoverFillOrStrokeColor = (d) => {
    const hoverColorScale = getHoverColorScale()
    return d.properties.name !== 'Amsterdam' && hoverColorScale(d.properties.books.length)
}

const drawCircles = () => {
    const { cities } = geoJson

    svg.selectAll('circle')
        .data(cities.features)
        .enter()
        .append('circle')
            .attr('r', 9)
            .attr('class', getCityStyleClassFromData)
            .style('fill', getNormalFillOrStrokeColor)
            .style('stroke', getNormalFillOrStrokeColor)
            .on('click', handleCircleClick)
            .on('mouseover', function() {
                d3.select(this)
                    .style('fill', getHoverFillOrStrokeColor)
                    .style('stroke', getHoverFillOrStrokeColor)
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .style('fill', getNormalFillOrStrokeColor)
                    .style('stroke', getNormalFillOrStrokeColor)
            })

    drawLines()
}

const setLineToActive = (cityName) => {
    const className = `line--${cityName}`

    const t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear)

    d3.select(`.${className}`)
        .transition(t)
        .style('stroke-width', '5')
}

const handleOnAmsterdamLegendItemClick = (event) => {
    map.flyTo({
        center: [
            4.899431,
            52.379189,
        ],
        zoom: 9,
    })
}

const setupListeners = () => {
    const amsterdamLegendElement = document.getElementById('legend-item--amsterdam')
    const selectionElement = document.getElementById('select-plane')

    amsterdamLegendElement.addEventListener('click', handleOnAmsterdamLegendItemClick)
    selectionElement.addEventListener('change', handleOnSelectorChange)
}

const animateOnDataLoaded = () => {
    const t = d3.transition()
        .duration(600)
        .ease(d3.easeLinear)

    d3.select('body')
        .transition(t)
        .style('opacity', '1')

    d3.select('.page-header')
        .transition(t)
        .style('transform', 'translateY(0)')

    d3.select('aside')
        .transition(t)
        .style('transform', 'translateX(0)')
}

const createScaleLegend = () => {
    const node = document.getElementById('legend-item-list')
    const { width } = node.getBoundingClientRect()
    const titleNode = document.createElement('h3')
    titleNode.textContent = 'Aantal boeken'
    const li = document.createElement('li')
    li.appendChild(titleNode)
    li.id = 'legend-item--scale'
    node.appendChild(li)

    const height = 20

    const key = d3.select('#legend-item--scale')
        .append('svg')
        .attr('id', 'scale-svg')
        .attr('width', width - 20)
        .attr('height', height)

    const legend = key.append('defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad')

    legend.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#66FCF1')
        .attr('stop-opacity', 1)

    legend.append('stop')
        .attr('offset', '33%')
        .attr('stop-color', '#54B8D7')
        .attr('stop-opacity', 1)

    legend.append('stop')
        .attr('offset', '66%')
        .attr('stop-color', '#4173BC')
        .attr('stop-opacity', 1)

    legend.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#2F2FA2')
        .attr('stop-opacity', 1)

    key.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(#gradient)')

    const startNode = document.createElement('span')
    const endNode = document.createElement('span')
    const divNode = document.createElement('div')

    startNode.textContent = getMinAmountOfBooks()
    endNode.textContent = getMaxAmountOfBooks()
    divNode.appendChild(startNode)
    divNode.appendChild(endNode)
    li.appendChild(divNode)
}

const setWindowZoomListener = () => {
    map.on('zoom', (e) => {
        const t = d3.transition()
            .duration(300)
            .ease(d3.easeLinear)

        svg.selectAll('circle')
            .transition(t)
            .attr('r', map.getZoom())
    })
}

map.on('load', async () => {
    try {
        geoJson.cities = await d3.json('https://raw.githubusercontent.com/Maikxx/frontend-data/master/data/city.geo.json')
        geoJson.lines = await d3.json('https://raw.githubusercontent.com/Maikxx/frontend-data/master/data/cityConnections.geo.json')

        animateOnDataLoaded()
        drawCircles()
        createScaleLegend()
        setWindowZoomListener()
    } catch (error) {
        toastError(error)
    }
})

window.addEventListener('load', (event) => {
    setupListeners()
    setUISelectionSettings()
})