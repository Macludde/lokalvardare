import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Box, Button, IconButton, Typography } from '@mui/material'
import {
    collection,
    deleteDoc,
    doc,
    documentId,
    getDocs,
    getFirestore,
    increment,
    query,
    runTransaction,
    updateDoc,
    where,
} from 'firebase/firestore'
import React, { useEffect, useMemo, useState } from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import DeleteIcon from '@mui/icons-material/Delete'
import { Comment as CommentType, User } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import CommentInput from './CommentInput'

type CommentProps = {
    comment: CommentType & { id: string }
    postId: string
    childComments?: (CommentType & { id: string })[]
    onReply: (text: string, parent: string) => Promise<void>
}
const db = getFirestore()

const Comment: React.FC<CommentProps> = ({
    comment,
    postId,
    childComments,
    onReply,
}) => {
    const { uid, isAnonymous: isGuest } = useAuth()
    // TODO: Uncomment this and use it
    const [author, authorLoading /* , authorError */] = useDocumentDataOnce(
        doc(db, 'users', comment.author),
        {
            transform: (val) => val as User,
        }
    )
    const [isLiked, setIsLiked] = useState(
        comment.likes?.includes(uid) ?? false
    )
    const [isReplying, setIsReplying] = useState(false)
    const [showChildren, setShowChildren] = useState(
        comment.parent.split('/').length < 2
    )

    const toggleLike = () => {
        if (!uid) return
        setIsLiked((curr) => !curr)
        runTransaction(db, async (transaction) => {
            const docRef = doc(db, 'posts', postId, 'comments', comment.id)
            const transactionPost = await transaction.get(docRef)
            if (!transactionPost.exists) {
                throw new Error('Comment has been deleted has been deleted')
            }
            const likes = transactionPost.data()?.likes ?? []
            let newLikes = []
            if (likes.includes(uid)) {
                newLikes = likes.filter((id: string) => id !== uid)
            } else {
                newLikes = [...likes, uid]
            }

            transaction.update(docRef, {
                likes: newLikes,
            })
        })
    }

    useEffect(() => {
        setIsLiked(comment.likes?.includes(uid) ?? false)
    }, [comment.likes, uid])

    const sortedChildComponents = useMemo(
        () =>
            childComments
                ?.filter((childComment) =>
                    childComment.parent.endsWith(comment.id)
                )
                .sort(
                    (a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0)
                ),
        [childComments, comment.id]
    )

    if (authorLoading) return null

    const deleteComment = async () => {
        if (
            !window.confirm(
                'Är du säker du vill ta bort denna mäktiga kommentar?'
            )
        )
            return
        try {
            const commentDoc = doc(db, 'posts', postId, 'comments', comment.id)
            if ((childComments?.length ?? 0) > 0) {
                const subDocs = await getDocs(
                    query(
                        collection(db, 'posts', postId, 'comments'),
                        where(
                            documentId(),
                            'in',
                            childComments?.map(
                                (childComment) => childComment.id
                            )
                        )
                    )
                )
                deleteDoc(commentDoc)
                subDocs.docs.forEach((subDoc) => deleteDoc(subDoc.ref))
                updateDoc(doc(db, 'posts', postId), {
                    amountOfComments: increment(-(1 + subDocs.docs.length)),
                })
            } else {
                deleteDoc(commentDoc)
                updateDoc(doc(db, 'posts', postId), {
                    amountOfComments: increment(-1),
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    /* Instantly updates likes when clicking */
    const likes =
        (comment.likes?.length ?? 0) +
        (comment.likes?.includes(uid) ? -1 : 0) +
        (isLiked ? 1 : 0)

    const subChildComponents = (childComment: CommentType & { id: string }) =>
        childComments?.filter((c) =>
            c.parent.startsWith(
                `${comment.parent}/${comment.id}/${childComment.id}`
            )
        ) as unknown as (CommentType & { id: string })[]

    return (
        <Box sx={{ padding: 1, paddingLeft: 2, paddingRight: 0 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="flex-start"
                    style={{
                        marginLeft:
                            (sortedChildComponents?.length ?? 0) > 0
                                ? '-32px'
                                : 0,
                    }}
                >
                    {(sortedChildComponents?.length ?? 0) > 0 && (
                        <IconButton
                            sx={{
                                padding: 0,
                                paddingRight: 1,
                                paddingTop: 2,
                            }}
                            onClick={() => setShowChildren((curr) => !curr)}
                        >
                            {showChildren ? (
                                <ExpandLessIcon />
                            ) : (
                                <ExpandMoreIcon />
                            )}
                        </IconButton>
                    )}
                    <Box>
                        <Typography component="div" sx={{ fontSize: 12 }}>
                            {author?.name}
                        </Typography>
                        <Typography component="div" sx={{}}>
                            {comment.content}
                        </Typography>
                        <Box>
                            <IconButton
                                onClick={toggleLike}
                                sx={{ paddingLeft: 0 }}
                            >
                                {isLiked ? (
                                    <FavoriteIcon color="primary" />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>
                            {likes}
                        </Box>
                    </Box>
                </Box>
                {!isGuest && (
                    <Box>
                        {comment.author === uid && (
                            <IconButton onClick={deleteComment}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        )}
                        <Button onClick={() => setIsReplying((curr) => !curr)}>
                            {isReplying ? 'Avbryt' : 'Svara'}
                        </Button>
                    </Box>
                )}
            </Box>
            {isReplying && (
                <CommentInput
                    onSubmit={async (text) => {
                        try {
                            await onReply(
                                text,
                                `${comment.parent}/${comment.id}`
                            )
                            setIsReplying(false)
                        } catch (e) {
                            setIsReplying(false)
                        }
                    }}
                    title="Svar"
                />
            )}
            {showChildren && (
                <Box sx={{}}>
                    {sortedChildComponents?.map((childComment) => (
                        <Comment
                            key={childComment.id}
                            comment={childComment}
                            postId={postId}
                            childComments={subChildComponents(childComment)}
                            onReply={onReply}
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default Comment
