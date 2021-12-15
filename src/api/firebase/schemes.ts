import { Timestamp } from 'firebase/firestore'

export interface User {
    name: string
}

export interface Post {
    title: string
    author: string
    timestamp: Timestamp
    amountOfComments: number
    likes: string[]
}

export interface Comment {
    authur: string
    content: string
    likes: string[]
    parent: 'root' | string
}
