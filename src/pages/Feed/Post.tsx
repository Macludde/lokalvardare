import { Button, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { doc, getFirestore } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { User } from '../../api/firebase/schemes'
import usePosts, { PostWithID } from '../../hooks/usePosts'
import { PostImage } from './styles'

type PostProps = {
    post: PostWithID
}

const db = getFirestore()
const storage = getStorage()

const Post: React.FC<PostProps> = ({ post }) => {
    const [author, authorLoading, authorError] = useDocumentDataOnce(
        doc(db, 'users', post.author),
        {
            transform: (val) => val as User,
        }
    )
    const [imageURL, setImageURL] = useState<string | null>(null)

    useEffect(() => {
        getDownloadURL(ref(storage, `posts/${post.id}`)).then((url) =>
            setImageURL(url)
        )
    }, [])

    return (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h4">{post.title}</Typography>
            <Typography>{author?.name ?? ''}</Typography>
            <PostImage src={imageURL ?? ''} alt="post content" />
        </Paper>
    )
}

export default Post
