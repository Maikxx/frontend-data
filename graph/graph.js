mapboxgl.accessToken = 'pk.eyJ1IjoibWFpa3h4IiwiYSI6ImNqb2p0b2c1ZzA4NWIzdnBhNTJhMjk3MmIifQ.WWh5GShedNrj-2eYYnkXxw'

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 11.5,
    center: [4.899431, 52.379189],
})

const canvas = map.getCanvasContainer()
const svg = d3.select(canvas).append('svg')
const project = d => map.project(new mapboxgl.LngLat(+d[0], +d[1]))

const triggerUpdate = () => {
    update()

    map.on('viewreset', update)
    map.on('move', update)
    map.on('moveend', update)
}

function projectPoint (lon, lat) {
    const point = map.project(new mapboxgl.LngLat(lon, lat))
    this.stream.point(point.x, point.y)
}

const transform = d3.geoTransform({ point: projectPoint })
const path = d3.geoPath().projection(transform)

const update = (transitionTime = 0) => {
    svg.selectAll('.city')
        .transition()
        .duration(transitionTime)
            .attr('cx', d => project(d.geometry.coordinates).x )
            .attr('cy', d => project(d.geometry.coordinates).y )

    svg.selectAll('path')
        .transition()
        .duration(transitionTime)
            .attr('d', path)
}

const getCityStyleClassFromData = (data) => {
    return data.properties.dataClass === 'main'
        ? 'city city--main'
        : 'city'
}

const drawLines = (lines) => {
    svg.selectAll('path')
        .data(lines.features)
        .enter()
        .append('path')
            .attr('d', path)
            .attr('class', d => `line line--${d.properties.fromCity.toLowerCase().replace(' ', '_')}`)

    triggerUpdate()
}

const getTransformedCityName = (cityName) => {
    return cityName
        .toLowerCase()
        .replace(' ', '_')
}

const filterLinesByCityName = (lines, cityName) => {
    return lines.features.filter(feature => {
        const transformedCityName = getTransformedCityName(feature.properties.fromCity)
        return transformedCityName === cityName
    })
}

const setD3LineClassName = (cityName) => {
    const className = `line--${cityName}`
    const shouldLineBeShown = d3.select(`.${className}`).classed('line--visible')
        ? false
        : true

    d3.select(`.${className}`)
        .classed('line--visible', shouldLineBeShown)
}

function handleCircleClick(d, lines) {
    const { name: cityName } = d.properties

    this.classList.contains('city--active')
        ? this.classList.remove('city--active')
        : this.classList.add('city--active')

    if (cityName === 'Amsterdam') {
        return null
    }

    const transformedCityName = getTransformedCityName(cityName)
    setD3LineClassName(transformedCityName)

    const lineByCityName = filterLinesByCityName(lines, transformedCityName)[0]
    const distanceBetweenCities = turf.lineDistance(lineByCityName)
    console.log(distanceBetweenCities)
}

const drawCircles = (cities, lines) => {
    svg.selectAll('circle')
        .data(cities.features)
        .enter()
        .append('circle')
            .attr('r', 8)
            .attr('class', getCityStyleClassFromData)
            .on('click', function (d) { handleCircleClick.call(this, d, lines) })

    drawLines(lines)
}

map.on('load', async () => {
    const cities = await d3.json('//api.jsonbin.io/b/5bf00a8518a56238b6f7c928/4')
    const lines = await d3.json('//api.jsonbin.io/b/5bf149b973474c2f8d97dcce')
    drawCircles(cities, lines)
})

