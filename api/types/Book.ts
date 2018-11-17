export interface Book {
    locationName?: string
    book?: string
    publicationYear: number
}

export interface TransformedBook {
    locationName?: string
    book?: string
    publicationYear: number
}

export interface BooksByLocation {
    key: string
    values: TransformedBook[]
}
