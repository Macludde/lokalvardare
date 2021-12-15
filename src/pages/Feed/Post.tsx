import ChatIcon from '@mui/icons-material/Chat'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import { doc, getFirestore, runTransaction } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { User } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import { PostWithID } from '../../hooks/usePosts'
import { PostImage } from './styles'

type PostProps = {
    post: PostWithID
    hideComments?: boolean
}

const db = getFirestore()
const storage = getStorage()

const Post: React.FC<PostProps> = ({ post, hideComments, children }) => {
    const { uid } = useAuth()
    // TODO: Comment these out and use them
    const [author /* , authorLoading, authorError */] = useDocumentDataOnce(
        doc(db, 'users', post.author),
        {
            transform: (val) => val as User,
        }
    )
    const [imageURL, setImageURL] = useState<string | null>(null)
    const [isLiked, setIsLiked] = useState(post.likes?.includes(uid) ?? false)
    const navigate = useNavigate()

    useEffect(() => {
        getDownloadURL(ref(storage, `posts/${post.id}`)).then((url) =>
            setImageURL(url)
        )
    }, [post.id])

    const toggleLike = () => {
        if (!uid) return
        setIsLiked((curr) => !curr)
        runTransaction(db, async (transaction) => {
            const docRef = doc(db, 'posts', post.id)
            const transactionPost = await transaction.get(docRef)
            if (!transactionPost.exists) {
                throw new Error('Post has been deleted')
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
        setIsLiked(post.likes?.includes(uid) ?? false)
    }, [post.likes, uid])

    const viewComments = () => {
        navigate(`/feed/post/${post.id}`)
    }

    /* Instantly updates likes when clicking */
    const likes =
        (post.likes?.length ?? 0) +
        (post.likes?.includes(uid) ? -1 : 0) +
        (isLiked ? 1 : 0)

    return (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h4">{post.title}</Typography>
            <Typography>{author?.name ?? ''}</Typography>
            {imageURL && <PostImage src={imageURL} alt="post content" />}
            <Box display="flex" alignItems="center">
                <IconButton onClick={toggleLike}>
                    {isLiked ? (
                        <FavoriteIcon color="primary" />
                    ) : (
                        <FavoriteBorderIcon />
                    )}
                </IconButton>
                {likes}
                {!hideComments && (
                    <>
                        <IconButton
                            sx={{ marginLeft: 2 }}
                            onClick={viewComments}
                        >
                            <ChatIcon />
                        </IconButton>
                        {post.amountOfComments ?? 0}
                    </>
                )}
            </Box>
            {children}
        </Paper>
    )
}

export default Post
