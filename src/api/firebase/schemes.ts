import { Timestamp } from 'firebase/firestore'

export interface User {
    name: string
}

export interface Post {
    title: string
    author: string
    timestamp: Timestamp
}
