import { LoadingButton } from '@mui/lab'
import { Box, Paper, TextField } from '@mui/material'
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { ImageInput, ImagePreview } from './styles'

const storage = getStorage()
const firestore = getFirestore()

const postsCollection = collection(firestore, 'posts')

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadLoading, setUploadLoading] = useState(false)
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
        setUploadLoading(true)
        try {
            const newDoc = await addDoc(postsCollection, {
                title,
                author: uid,
                timestamp: serverTimestamp(),
            })
            await uploadBytes(
                ref(storage, `posts/${uid}/${newDoc.id}`),
                selectedFile
            )
            setUploadLoading(false)
            navigate(`/feed/${newDoc.id}`)
        } catch (e: any) {
            console.error(e.code, e.message)
            setUploadLoading(false)
        }
    }

    return (
        <Paper sx={{ padding: 4 }}>
            <h3>Skapa inlägg</h3>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
                {/* Post title */}
                <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    label="Title"
                    type="outlined"
                    style={{ marginBottom: 32, width: '100%' }}
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
                <LoadingButton
                    onClick={upload}
                    variant="contained"
                    loading={uploadLoading}
                >
                    Lägg upp
                </LoadingButton>
            </Box>
        </Paper>
    )
}

export default CreatePost
