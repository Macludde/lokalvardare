import { Select } from '@material-ui/core'
import { LoadingButton } from '@mui/lab'
import { Box, MenuItem, Paper, TextField } from '@mui/material'
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Post } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import { routes } from '../../Router'
import { ImageInput, ImagePreview } from './styles'

const storage = getStorage()
const firestore = getFirestore()

const postsCollection = collection(firestore, 'posts')

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [textContent, setTextContent] = useState('')
    const [uploadLoading, setUploadLoading] = useState(false)
    const { uid, isAnonymous: isGuest } = useAuth()
    const [contentType, setContentType] = useState<Post['type']>('image')
    const navigate = useNavigate()

    useEffect(() => {
        if (isGuest) {
            navigate(routes[0].path)
        }
    }, [isGuest, navigate])

    const handleUploadClick: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        const file = event.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
    }

    const upload = async () => {
        setUploadLoading(true)
        try {
            const data: Record<string, any> = {
                title,
                author: uid,
                timestamp: serverTimestamp(),
                type: contentType,
            }
            console.log(contentType, textContent, selectedFile)
            let newDoc
            switch (contentType) {
                case 'image':
                    if (!selectedFile) return
                    data.fileName = selectedFile.name
                    newDoc = await addDoc(postsCollection, data)
                    await uploadBytes(
                        ref(
                            storage,
                            `posts/${uid}/${newDoc.id}/${
                                selectedFile.name ?? 'unnamedFile'
                            }`
                        ),
                        selectedFile
                    )
                    break
                case 'file':
                    if (!selectedFile) return
                    data.fileName = selectedFile.name
                    newDoc = await addDoc(postsCollection, data)
                    await uploadBytes(
                        ref(
                            storage,
                            `posts/${uid}/${newDoc.id}/${selectedFile.name}`
                        ),
                        selectedFile
                    )
                    break
                case 'text':
                    if (!textContent) return
                    data.content = textContent
                    newDoc = await addDoc(postsCollection, data)
                    break
                default:
                    throw new Error('Unsupported content type')
            }

            setUploadLoading(false)
            if (newDoc) {
                navigate(`/feed/post/${newDoc.id}`)
            }
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
                <Select
                    value={contentType}
                    onChange={(e) =>
                        setContentType(e.target.value as Post['type'])
                    }
                    variant="outlined"
                    style={{ marginBottom: 32, width: '50%' }}
                >
                    <MenuItem value="image">Bild</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="file">Fil</MenuItem>
                </Select>
                {/* Post content */}
                {contentType === 'image' && (
                    <>
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
                    </>
                )}
                {contentType === 'file' && (
                    <ImageInput
                        id="contained-button-file"
                        type="file"
                        onChange={handleUploadClick}
                    />
                )}
                {contentType === 'text' && (
                    <TextField
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        label="Innehåll"
                        type="outlined"
                        multiline
                        style={{ marginBottom: 32, width: '100%' }}
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
