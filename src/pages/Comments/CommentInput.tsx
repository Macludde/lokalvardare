import { Box, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React from 'react'

type CommentInputProps = {
    onSubmit: (text: string) => Promise<void>
    title: string
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit, title }) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [text, setText] = React.useState('')

    const post = async () => {
        if (!text?.trim()) return
        try {
            setIsLoading(true)
            await onSubmit(text.trim())
            setText('')
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            post()
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1, marginRight: 16 }}
                label={title}
                variant="outlined"
                multiline
                onKeyPress={handleKeyPress}
            />
            <LoadingButton
                variant="contained"
                loading={isLoading}
                onClick={post}
                style={{ paddingLeft: 32, paddingRight: 32 }}
                disabled={!text?.trim()}
            >
                Post
            </LoadingButton>
        </Box>
    )
}

export default CommentInput
