import { Box, Button, Paper, TextField } from '@mui/material'
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { ImageInput, ImagePreview } from './styles'

const storage = getStorage()
const firestore = getFirestore()

const postsRef = ref(storage, 'posts')
const postsCollection = collection(firestore, 'posts')

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const { uid } = useAuth()
    const navigate = useNavigate()

    const handleUploadClick: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        const file = event.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
    }

    const upload = async () => {
        if (!selectedFile) return
        try {
            const newDoc = await addDoc(postsCollection, {
                title,
                author: uid,
                timestamp: serverTimestamp(),
            })
            await uploadBytes(ref(storage, `posts/${newDoc.id}`), selectedFile)
            navigate(`/feed/${newDoc.id}`)
        } catch (e: any) {
            console.error(e.code, e.message)
        }
    }

    return (
        <Paper sx={{ padding: 4 }}>
            <h3>Create new post</h3>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
                {/* Post title */}
                <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    label="Title"
                    type="outlined"
                    sx={{ marginBottom: 4, width: '100%' }}
                />
                {/* Post content */}
                <ImageInput
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={handleUploadClick}
                />
                {selectedFile && (
                    <ImagePreview
                        src={URL.createObjectURL(selectedFile)}
                        alt="uploaded"
                    />
                )}
                <Button onClick={upload} variant="contained">
                    Post
                </Button>
            </Box>
        </Paper>
    )
}

export default CreatePost
