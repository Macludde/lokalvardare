import ChatIcon from '@mui/icons-material/Chat'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import {
    Box,
    IconButton,
    Link as MUILink,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material'
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    runTransaction,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'
import { User } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import { PostWithID } from '../../hooks/usePosts'
import LikesModal from './LikesModal'
import PostMenu from './PostMenu'
import { PostImage } from './styles'

type PostProps = {
    post: PostWithID
    hideComments?: boolean
}

const db = getFirestore()
const storage = getStorage()

const Post: React.FC<PostProps> = ({ post, hideComments, children }) => {
    const { uid, isAnonymous: isGuest } = useAuth()
    // TODO: Comment these out and use them
    const [author /* , authorLoading, authorError */] = useDocumentDataOnce(
        doc(db, 'users', post.author),
        {
            transform: (val) => val as User,
        }
    )
    const [imageURL, setImageURL] = useState<string | null>(null)
    const [isLiked, setIsLiked] = useState(post.likes?.includes(uid) ?? false)
    const [likesOpen, setLikesOpen] = useState(false)

    useEffect(() => {
        getDownloadURL(ref(storage, `posts/${post.author}/${post.id}`)).then(
            (url) => setImageURL(url)
        )
    }, [post.id, post.author])

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

    const deletePost = async () => {
        if (!uid) return
        if (
            window.confirm(
                'Är du säker på att du vill ta bort denna fuktiga meme?'
            )
        ) {
            try {
                await runTransaction(db, async (transaction) => {
                    const docRef = doc(db, 'posts', post.id)
                    const transactionPost = await transaction.get(docRef)
                    if (!transactionPost.exists) {
                        throw new Error('Post has been deleted')
                    }
                    transaction.delete(docRef)
                    const commentsRef = collection(
                        db,
                        'posts',
                        post.id,
                        'comments'
                    )
                    const comments = await getDocs(commentsRef)
                    comments.forEach((comment) => {
                        transaction.delete(comment.ref)
                    })
                })
                await deleteObject(
                    ref(storage, `posts/${post.author}/${post.id}`)
                )
            } catch (e: any) {
                console.error(e.code, e.message)
            }
        }
    }

    useEffect(() => {
        setIsLiked(post.likes?.includes(uid) ?? false)
    }, [post.likes, uid])

    /* Instantly updates likes when clicking */
    const likes =
        (post.likes?.length ?? 0) +
        (post.likes?.includes(uid) ? -1 : 0) +
        (isLiked ? 1 : 0)

    return (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
            {likesOpen && (
                <LikesModal
                    onClose={() => setLikesOpen(false)}
                    likeUIDs={post.likes ?? []}
                />
            )}
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">{post.title}</Typography>
                {uid === post.author && <PostMenu onDeletePost={deletePost} />}
            </Box>
            <Typography>{author?.name ?? ''}</Typography>
            <Box
                display="flex"
                minWidth="100%"
                minHeight="200px"
                alignItems="center"
            >
                {imageURL && <PostImage src={imageURL} alt="post content" />}
            </Box>
            <Box display="flex" alignItems="center">
                {!isGuest ? (
                    <IconButton onClick={toggleLike}>
                        {isLiked ? (
                            <FavoriteIcon color="primary" />
                        ) : (
                            <FavoriteBorderIcon />
                        )}
                    </IconButton>
                ) : (
                    <Tooltip title="Du måste logga in med Google för att gilla">
                        <Box>
                            <IconButton onClick={toggleLike} disabled>
                                {isLiked ? (
                                    <FavoriteIcon color="primary" />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>
                        </Box>
                    </Tooltip>
                )}
                {likes > 0 ? (
                    <Tooltip title="Se vem som gillat">
                        <MUILink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                setLikesOpen(true)
                            }}
                            underline="hover"
                            color="inherit"
                        >
                            {likes}
                        </MUILink>
                    </Tooltip>
                ) : (
                    0
                )}
                {!hideComments && (
                    <>
                        <IconButton
                            component={Link}
                            to={`/feed/post/${post.id}`}
                            sx={{ marginLeft: 2 }}
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
