import { FirebaseError } from 'firebase/app'
import {
    collection,
    DocumentData,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { Post } from '../api/firebase/schemes'

const db = getFirestore()
const postsCollection = collection(db, 'posts')

const usePosts: () => [
    Post[],
    boolean,
    {
        error?: FirebaseError
        loadMore: () => void
    }
] = () => {
    const [postDocs, setPostDocs] = useState<
        QueryDocumentSnapshot<DocumentData>[]
    >([])
    const [postsLimit, setPostsLimit] = useState(50)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        const q = query(
            postsCollection,
            orderBy('timestamp', 'desc'),
            limit(postsLimit)
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setIsLoading(false)
            setPostDocs(snapshot.docs)
        })
        return () => unsubscribe()
    }, [postsLimit])

    const posts = useMemo(() => {
        return postDocs.map((doc) => {
            const data = doc.data() as Post
            return { ...data, id: doc.id }
        })
    }, [postDocs])

    return [
        posts,
        isLoading,
        {
            error: undefined,
            loadMore: () => setPostsLimit((curr) => curr + 50),
        },
    ]
}

export default usePosts
