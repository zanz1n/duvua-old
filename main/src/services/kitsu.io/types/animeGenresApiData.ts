export interface AnimeRelationshipGenresResponseMeta {
    count: number
}

export interface AnimeRelationshipGenresResponseDataAttributes {
    createdAt: string
    updatedAt: string
    name: string
    slug: string
    description: string | null
}

export interface AnimeRelationshipGenresResponseData {
    id: string
    type: "genres"
    links: {
        self: string
    }
    attributes: AnimeRelationshipGenresResponseDataAttributes
}

export interface AnimeRelationshipGenresResponseLinks {
    first: string
    last: string
}

export interface AnimeRelationshipGenresResponse {
    data: AnimeRelationshipGenresResponseData[]
    meta: AnimeRelationshipGenresResponseMeta
    links: AnimeRelationshipGenresResponseLinks
}
