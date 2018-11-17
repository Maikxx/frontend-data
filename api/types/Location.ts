export interface LocationIQPlace {
    place_id: string
    licence: string
    osm_type: string
    osm_id: string
    boundingbox: string[]
    lat: string
    lon: string
    display_name: string
    class: string
    type: string
    importance: number
    icon: string
}

export interface GeoLocationCollection {
    type: string
    features: GeoLocationFeature[]
}

export interface GeoLocationFeature extends GeoLocationFeatureGeometry {
    feature: string
    properties: GeoLocationFeatureProperties
}

export interface GeoLocationFeatureProperties {
    name: string
    dataClass: string
    books: string[]
}

export interface GeoLocationFeatureGeometry {
    geometry: {
        type: string
        coordinates: string[]
    }
}
