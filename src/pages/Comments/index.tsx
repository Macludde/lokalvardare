import {
    collection,
    doc,
    FirestoreError,
    getFirestore,
} from 'firebase/firestore'
import React from 'react'
import {
    useCollectionData,
    useDocumentData,
} from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import { Comment } from '../../api/firebase/schemes'
import { PostWithID } from '../../hooks/usePosts'
import Post from '../Feed/Post'
import Loading from '../Loading'

const db = getFirestore()

const Comments = () => {
    const { id } = useParams()
    const [post, postLoading, postError] = useDocumentData(
        doc(db, 'posts', id ?? 'never'),
        {
            transform: (val) => val as PostWithID,
            idField: 'id',
        }
    )
    const [comments, loading, error] = useCollectionData(
        collection(db, 'posts', id ?? 'never', 'comments'),
        {
            transform: (val) => val as Comment & { id: string },
            idField: 'id',
        }
    )

    if (postLoading || loading) return <Loading />

    console.log(comments)
    return (
        <div>
            <Post post={post as unknown as PostWithID} hideComments />
            Comments
        </div>
    )
}

export default Comments
