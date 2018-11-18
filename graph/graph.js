// MapBox //

mapboxgl.accessToken = 'pk.eyJ1IjoibWFpa3h4IiwiYSI6ImNqb2p0b2c1ZzA4NWIzdnBhNTJhMjk3MmIifQ.WWh5GShedNrj-2eYYnkXxw'

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 11.5,
    center: [4.899431, 52.379189],
})

// Binding D3 and MapBox //
const canvas = map.getCanvasContainer()
const svg = d3.select(canvas).append('svg')
const project = d => map.project(new mapboxgl.LngLat(+d[0], +d[1]))


function projectPoint (lon, lat) {
    const point = map.project(new mapboxgl.LngLat(lon, lat))
    this.stream.point(point.x, point.y)
}

const transform = d3.geoTransform({ point: projectPoint })
const path = d3.geoPath().projection(transform)

// D3 //
const triggerUpdate = () => {
    // Call the update function
    update()

    // Update on map interaction
    map.on('viewreset', () => update())
    map.on('move', () => update())
    map.on('moveend', () => update())
}

/**
* @param {Number} transitionTime
*/
const update = (transitionTime = 0) => {
    svg.selectAll('circle')
        .transition()
        .duration(transitionTime)
            .attr('cx', d => project(d.geometry.coordinates).x )
            .attr('cy', d => project(d.geometry.coordinates).y )

    svg.selectAll('path')
        .transition()
        .duration(transitionTime)
            .attr('d', path)
}

/**
* @param {Object} data
* @param {String} data.type
* @param {Object} data.properties
* @param {String} data.properties.name
* @param {String} data.properties.dataClass
* @param {String[]} data.properties.books
* @param {Object} data.geometry
* @param {String} data.geometry.type
* @param {Array} data.geometry.coordinates
* @param {Number} data.geometry.coordinates[].lon
* @param {Number} data.geometry.coordinates[].lat
*/
const getStyleClassFromDataClass = data => {
    return data.properties.dataClass === 'main'
        ? 'circle--main'
        : 'circle'
}

let lines

const drawLines = lines => {
    lines = svg.selectAll('path')
        .data(lines.features)
        .enter()
        .append('path')
            .attr('d', path)
            .attr('class', d => `line line--${d.properties.fromCity.toLowerCase().replace(' ', '_')}`)

    triggerUpdate()
}

let circles

const drawCircles = (circles, lines) => {
    circles = svg.selectAll('circle')
        .data(circles.features)
        .enter()
        .append('circle')
            .attr('r', 8)
            .attr('class', getStyleClassFromDataClass)
            .on('click', d => {
                const { name: cityName } = d.properties

                if (cityName === 'Amsterdam') {
                    return null
                }

                const transformedCityName = cityName
                    .toLowerCase()
                    .replace(' ', '_')

                const className = `line--${transformedCityName}`
                const shouldLineBeShown = d3.select(`.${className}`).classed('line--visible')
                    ? false
                    : true

                d3.select(`.${className}`)
                    .classed('line--visible', shouldLineBeShown)

                // Think of something to show all the names of the books
            })

    drawLines(lines)
}

map.on('load', async () => {
    const circles = await d3.json('//api.jsonbin.io/b/5bf00a8518a56238b6f7c928/4')
    const lines = await d3.json('//api.jsonbin.io/b/5bf149b973474c2f8d97dcce')
    drawCircles(circles, lines)
})

