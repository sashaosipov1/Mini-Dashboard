export interface Post {
    id: number
    title: string
    content: string
    author: string
    published: boolean
    createdAt: string
    updatedAt: string
}

export type PostRequest = Pick<Post, "title" | "content" | "author" | "published">;

export interface Posts<T> {
    success: boolean
    data: T[]
    pagination: {
        limit: number
        offset: number
        totalItems: number
    }
}