import { Box, Modal, Typography } from '@mui/material'
import { User } from 'firebase/auth'
import {
    collection,
    documentId,
    getFirestore,
    query,
    where,
} from 'firebase/firestore'
import React from 'react'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import Loading from '../Loading'

type LikesModalProps = {
    likeUIDs: string[]
    onClose: () => void
}

const db = getFirestore()

const LikesModal: React.FC<LikesModalProps> = ({ likeUIDs, onClose }) => {
    const [users, loading] = useCollectionDataOnce(
        query(
            collection(db, 'users'),
            where(
                documentId(),
                'in',
                likeUIDs.length === 0 ? ['none'] : likeUIDs
            )
        ),
        {
            transform: (val) => val as User[],
            idField: 'uid',
        }
    )
    return (
        <Modal open onClose={onClose}>
            {loading ? (
                <Loading />
            ) : (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        padding: 3,
                        boxShadow: 24,
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Användare som gillar
                    </Typography>
                    {users?.map((user) => (
                        <Typography key={user.uid}>{user.name}</Typography>
                    ))}
                </Box>
            )}
        </Modal>
    )
}

export default LikesModal
