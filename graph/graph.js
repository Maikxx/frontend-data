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
// const path = svg.append('path')
const project = d => map.project(new mapboxgl.LngLat(+d[0], +d[1]))

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

    // svg.select('path')
    //     .transition()
    //     .duration(transitionTime)
    //         .attr('d', d => console.log(d))
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

// let line

// function projectPoint(lon, lat) {
//     let point = map.project(new mapboxgl.LngLat(lon, lat))
//     this.stream.point(point.x, point.y)
// }

// const transform = d3.geo.transform({ point: projectPoint })
// const linePath = d3.geo.path().projection(transform)

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
// const drawLine = data => {
//     const AMSTERDAM_COORDS = ['4.89797550561798', '52.3745403']
//     const selectedCityCoordinates = data.geometry.coordinates
//     const lineCoordinates = [selectedCityCoordinates, AMSTERDAM_COORDS]

//     // const path = d3.line()
//     //     .curve(d3.curveCardinal)

//     line = svg.select('path')
//         .attr('d', linePath(lineCoordinates))

//     // triggerUpdate()
// }

let circles

const drawCircles = data => {
    circles = svg.selectAll('circle')
        .data(data.features)
        .enter()
        .append('circle')
            .attr('r', 8)
            .attr('class', getStyleClassFromDataClass)
            .on('click', d => {
                // drawLine(d)
                // Think of something to show all the names of the books
            })

    triggerUpdate()
}

map.on('load', async () => {
    const data = await d3.json('//api.jsonbin.io/b/5bf00a8518a56238b6f7c928/4')

    drawCircles(data)
})

