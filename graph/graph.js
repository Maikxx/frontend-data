// Geolocation API //

// MapBox //

const view = "map"

mapboxgl.accessToken = 'pk.eyJ1IjoibWFpa3h4IiwiYSI6ImNqb2p0b2c1ZzA4NWIzdnBhNTJhMjk3MmIifQ.WWh5GShedNrj-2eYYnkXxw'

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 11.5,
    center: [4.899431, 52.379189],
})

// Binding D3 and MapBox //

const canvas = map.getCanvasContainer()

const svg = d3.select(canvas).append("svg")

map.on('load', async () => {
    const data = await d3.json("data/cityData.json")
    drawData(data)
})

const project = d => map.project(new mapboxgl.LngLat(+d[0], +d[1]))

// D3 //

// Draw GeoJSON data with d3
let circles
function drawData(data) {
    // Add circles
    circles = svg.selectAll("circle")
        .data(data.features)
        .enter()
        .append("circle")
            .attr("r", 16)
            .attr("class", d => d.properties.dataClass === 'main' ? 'circle--main' : 'circle')
            .on("click", (d) => {
                // Show all the circles
                alert(d.properties.name)
            })

    // Call the update function
    update()

    // Update on map interaction
    map.on("viewreset", () => update(0))
    map.on("move", () => update(0))
    map.on("moveend", () => update(0))
}

// Update function
function update(transitionTime) {
    // Default value = 0
    transitionTime = typeof transitionTime !== 'undefined'
        ? transitionTime
        : 0

    // Map view
    if (view === "map") {
        svg.selectAll("circle")
            .transition()
            .duration(transitionTime)
                .attr("cx", (d) => project(d.geometry.coordinates).x )
                .attr("cy", (d) => project(d.geometry.coordinates).y )

    // Grid view
    } else if (view === "grid") {
        let ix = 0
        let iy = 0
        let rows = 3
        let cols = 3

        // Check window with and height
        const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

        const gridItemWidth = (windowWidth * 0.8) / (cols + 1)
        const gridItemHeight = windowHeight / (rows + 1)

        svg.selectAll("circle")
            .each(function(d) {

                let circle = d3.select(this)

                console.log("ix: " + ix + ", iy: " + iy)

                circle
                    .transition()
                    .duration(transitionTime)
                        .attr("cx", d => (windowWidth * 0.2) + (ix * gridItemWidth) + (0.5 * gridItemWidth))
                        .attr("cy", d => (iy * gridItemHeight) + gridItemHeight)

                // Increase iterators
                ix++
                if (ix === cols) {
                    ix = 0
                    iy++
                }

                if (iy === rows) {
                    iy = 0
                }
            })
    }
}
