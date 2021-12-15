import { Box, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import usePosts from '../../hooks/usePosts'
import Post from './Post'

const Feed = () => {
    const navigate = useNavigate()
    const [posts, loading, { loadMore, reachedEnd }] = usePosts()
    console.log(posts)
    return (
        <Box>
            {posts.map((post) => (
                <Post post={post} key={post.id} />
            ))}
            {!reachedEnd && (
                <Button onClick={loadMore} disabled={loading}>
                    Load more
                </Button>
            )}
        </Box>
    )
}

export default Feed
