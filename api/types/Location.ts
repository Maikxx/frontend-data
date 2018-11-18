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
    error?: string
}

export interface GeoLocationCollection {
    type: string
    features: GeoLocationFeature[]
}

export interface GeoLocationFeature extends GeoLocationFeatureGeometry {
    type: string
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

export interface GeoLocationConnectionCollection {
    type: string
    features: GeoLocationConnectionCollectionFeature[]
}

export interface GeoLocationConnectionCollectionFeature extends GeoLocationConnectionGeometry {
    type: string
    properties: GeoLocationConnectionFeatureProperties
}

export interface GeoLocationConnectionFeatureProperties {
    toCity: string
    fromCity: string
}

export interface GeoLocationConnectionGeometry {
    geometry: {
        type: string
        coordinates: string[][]
    }
}
