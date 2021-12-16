import { Timestamp } from 'firebase/firestore'

export interface User {
    name: string
}

type PostBase = {
    title: string
    author: string
    timestamp: Timestamp
    amountOfComments: number
    likes: string[]
}

export type ImagePost = PostBase & {
    type: 'image'
    fileName: string
}
export type FilePost = PostBase & {
    type: 'file'
    fileName: string
}
export type TextPost = PostBase & {
    type: 'text'
    content: string
}

export type Post = ImagePost | FilePost | TextPost

export interface Comment {
    author: string
    content: string
    likes: string[]
    parent: 'root' | string
    timestamp: Timestamp
}
