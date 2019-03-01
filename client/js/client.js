require('babel-polyfill')
import * as d3 from 'd3'
import { setUISelectionSettings } from './setters/ui'
import { setupListeners } from './setters/interaction'
import { toastError } from './feedback/error'
import { animateOnDataLoaded } from './animations/pageLoad'
import { drawCircles } from './drawers/cities'
import { createScaleLegend } from './drawers/scaleLegend'
import { setWindowZoomListener } from './setters/interaction'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFpa3h4IiwiYSI6ImNqb2p0b2c1ZzA4NWIzdnBhNTJhMjk3MmIifQ.WWh5GShedNrj-2eYYnkXxw'

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 9,
    center: [4.899431, 52.379189],
    doubleClickZoom: false,
})

class Boilerplate {
    constructor() {
        this.geoJson = {
            lines: undefined,
            cities: undefined,
        }

        this.interactionOptions = {
            flySpeed: undefined,
            airplane: undefined,
            distanceBetweenCities: undefined,
            flyTimeInMinutes: undefined,
            readableFlyTime: undefined,
            cityName: undefined,
            bookNames: [],
            fromCityCoordinates: []
        }

        this.globe = map

        this.canvas = this.globe.getCanvasContainer()
        this.svg = d3.select(this.canvas).append('svg')
    }
}

export const state = new Boilerplate()

export const project = d => state.globe.project(new mapboxgl.LngLat(+d[0], +d[1]))

function projectPoint (lon, lat) {
    const { globe } = state
    const point = globe.project(new mapboxgl.LngLat(lon, lat))
    this.stream.point(point.x, point.y)
}

const transform = d3.geoTransform({ point: projectPoint })
export const path = d3.geoPath().projection(transform)

state.globe.on('load', async () => {
    try {
        state.geoJson.cities = await d3.json('https://raw.githubusercontent.com/Maikxx/frontend-data/master/data/city.geo.json')
        state.geoJson.lines = await d3.json('https://raw.githubusercontent.com/Maikxx/frontend-data/master/data/cityConnections.geo.json')

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