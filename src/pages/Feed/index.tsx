import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
    const navigate = useNavigate()
    return (
        <div>
            Feed
            <Button
                onClick={() => {
                    navigate('/feed/create')
                }}
            >
                Create new post
            </Button>
        </div>
    )
}

export default Feed
