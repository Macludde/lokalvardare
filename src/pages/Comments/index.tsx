import { Box } from '@mui/material'
import {
    addDoc,
    collection,
    doc,
    getFirestore,
    increment,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import React from 'react'
import {
    useCollectionData,
    useDocumentData,
} from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import { Comment } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import { PostWithID } from '../../hooks/usePosts'
import Post from '../Feed/Post'
import Loading from '../Loading'
import CommentInput from './CommentInput'

const db = getFirestore()

const Comments = () => {
    const { id } = useParams()
    const { uid } = useAuth()
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

    const postComment = async (text: string, parent: string) => {
        if (!id) return
        await addDoc(collection(db, 'posts', id, 'comments'), {
            author: uid,
            content: text,
            parent,
            timestamp: serverTimestamp(),
        })

        await updateDoc(doc(db, 'posts', id), {
            amountOfComments: increment(1),
        })
    }

    if (postLoading || loading) return <Loading />

    return (
        <Post post={post as unknown as PostWithID} hideComments>
            <Box marginTop={2} />
            <CommentInput
                onSubmit={async (text) => {
                    await postComment(text, 'root')
                }}
                title="Ny kommentar"
            />
            Comments
        </Post>
    )
}

export default Comments
