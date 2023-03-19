import { Box, Typography } from '@mui/material'
import {
    addDoc,
    collection,
    doc,
    getFirestore,
    increment,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import React, { useMemo } from 'react'
import {
    useCollectionData,
    useDocumentData,
} from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import { Comment as CommentType } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import { PostWithID } from '../../hooks/usePosts'
import Post from '../Feed/Post'
import Loading from '../Loading'
import Comment from './Comment'
import CommentInput from './CommentInput'

const db = getFirestore()

const Comments = () => {
    const { id } = useParams()
    const { uid, isLoggedIn } = useAuth()
    const [post, postLoading, postError] = useDocumentData(
        doc(db, 'posts', id ?? 'never'),
        {
            transform: (val) => val as PostWithID,
            idField: 'id',
        }
    )
    // TODO: Comment this out and use it
    const [comments, loading /* , error */] = useCollectionData(
        collection(db, 'posts', id ?? 'never', 'comments'),
        {
            transform: (val) => val as CommentType & { id: string },
            idField: 'id',
        }
    )

    const sortedComments = useMemo(() => {
        return comments
            ?.filter((comment) => comment.parent === 'root')
            .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
    }, [comments])

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

    if (postError) {
        console.error(postError)
    }

    if (postLoading || loading || !post) return <Loading />

    const amountOfComments = post?.amountOfComments ?? 0

    return (
        <Post post={post as unknown as PostWithID} hideComments>
            <Box marginTop={2} />
            {isLoggedIn ? (
                <CommentInput
                    onSubmit={async (text) => {
                        await postComment(text, 'root')
                    }}
                    title="Ny kommentar"
                />
            ) : (
                <Typography
                    component="div"
                    color="text.secondary"
                    fontSize={12}
                >
                    Du måste vara inloggad med Google för att kunna kommentera
                </Typography>
            )}
            <Typography component="div" sx={{ marginY: 2 }}>
                {amountOfComments}{' '}
                {amountOfComments === 1 ? 'kommentar' : 'kommentarer'}
            </Typography>
            {sortedComments?.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment as unknown as CommentType & { id: string }}
                    postId={id ?? 'never'}
                    childComments={
                        comments?.filter((c) =>
                            c.parent.startsWith(`root/${comment.id}`)
                        ) as unknown as (CommentType & { id: string })[]
                    }
                    onReply={postComment}
                />
            ))}
        </Post>
    )
}

export default Comments
