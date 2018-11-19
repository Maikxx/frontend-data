// Projection //
mapboxgl.accessToken = 'pk.eyJ1IjoibWFpa3h4IiwiYSI6ImNqb2p0b2c1ZzA4NWIzdnBhNTJhMjk3MmIifQ.WWh5GShedNrj-2eYYnkXxw'

const geoJson = {
    lines: undefined,
    cities: undefined,
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

// Filters //
const filterLinesByCityName = (cityName) => {
    const { lines } = geoJson

    return lines.features.filter(feature => {
        const transformedCityName = getTransformedCityName(feature.properties.fromCity)
        return transformedCityName === cityName
    })
}

// Handlers //
function handleCircleClick(d) {
    const { name: cityName } = d.properties

    this.classList.contains('city--active')
        ? this.classList.remove('city--active')
        : this.classList.add('city--active')

    if (cityName === 'Amsterdam') {
        return null
    }

    const transformedCityName = getTransformedCityName(cityName)
    setD3LineClassName(transformedCityName)

    const lineByCityName = filterLinesByCityName(transformedCityName)[0]
    const distanceBetweenCities = turf.lineDistance(lineByCityName)
    console.log(distanceBetweenCities)
}

function handleOnSelectorChange(e) {
    console.log(e)
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
    selectionElement.addEventListener('change', () => null)
}

// Initializer //
map.on('load', async () => {
    geoJson.cities = await d3.json('//api.jsonbin.io/b/5bf00a8518a56238b6f7c928/4')
    geoJson.lines = await d3.json('//api.jsonbin.io/b/5bf149b973474c2f8d97dcce')

    drawCircles()
})

window.addEventListener('load', (event) => {
    setupListeners()
})