import type { Document } from "@contentful/rich-text-types"
export type Destination = {
    metadata: {
        tags: string[]
    },
    sys: {
        space: {},
        id: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        environment: {},
        revision: number,
        contentType: {},
        locale: string,
    },
    fields: {
        title: string,
        image: {},
        description: Document
        htmlDescription?: string
    }
}
