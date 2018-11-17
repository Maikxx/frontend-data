export interface Result {
    author: Author
    images: string[]
    title: Title
    format: string
    identifiers: Identifier[]
    publication: Publication
    languages: Languages
    subjects: string[]
    genres: string[]
    characteristics: Characteristics
    summary: string
    notes: string[]
    targetAudiences: string[]
    series?: string
  }

  interface Characteristics {
    pages: number
    size?: string[] | string
    types: string[]
    raw: string
  }

  interface Languages {
    this: string
    original: string
  }

  interface Publication {
    year: string
    publisher?: string
    place?: string
  }

  interface Identifier {
    'isbn-id'?: string
    'ppn-id'?: string
    'cdr-id'?: string
  }

  interface Title {
    short?: string
    full?: string
  }

  interface Author {
    fullname: string
    firstname: string
    lastname: string
    gender?: string
  }