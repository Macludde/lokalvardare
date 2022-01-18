import { getAuth, User } from 'firebase/auth'
import { getFirestore, doc } from 'firebase/firestore'
import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'

const db = getFirestore()

const UserName: React.FC<{ uid: string }> = ({ uid }) => {
    const [user, loading, error] = useDocumentDataOnce(doc(db, `users/${uid}`))

    if (error) {
        console.error(error)
    }

    if (loading) return null

    return user?.name ?? 'Anonym'
}

export default UserName
