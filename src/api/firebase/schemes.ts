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
    type: 'image' | 'file'
    fileName?: string
}

export interface Comment {
    author: string
    content: string
    likes: string[]
    parent: 'root' | string
    timestamp: Timestamp
}
