import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as fbSignOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './config'
import { User } from './schemes'

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
const auth = getAuth()

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider)

        const credential = GoogleAuthProvider.credentialFromResult(result)
        if (credential === null) {
            throw new Error('Error with Google Sign in')
        }

        const { user } = result
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
            return
        }
        await setDoc(userRef, {
            name: user.displayName ?? user.email,
        } as User)
    } catch (error: any) {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.error(errorCode, errorMessage)
    }
}

export const signOut = async () => {
    try {
        await fbSignOut(auth)
    } catch (error: any) {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.error(errorCode, errorMessage)
    }
}
