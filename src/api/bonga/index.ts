/**
 * BongUser
 * - uid: string
 * - bongCount: number
 * - bongs: Collection ->
 *  - bongTimestamp: Timestamp
 *  - uid: string
 */

import {
    addDoc,
    collection,
    doc,
    getFirestore,
    increment,
    runTransaction,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'

/**
 * Firebase structure
 * /contestants/{contestantId} -> BongUser
 * /contestants/{contestantId}/bongs/{bongId} -> Bong
 * subcollectionQuery(/bongs) -> All bongs in the system (for leaderboard)
 */

const firestore = getFirestore()

const contestantCollection = collection(firestore, 'contestants')
export const registerContestant = (uid: string) => {
    const year = new Date().getFullYear()
    const bongUser = {
        uid,
        [`bongCount_${year}`]: 0,
    }
    addDoc(contestantCollection, bongUser)
}

export const registerBong = async (id: string, uid: string) => {
    const bong = {
        timestamp: serverTimestamp(),
        uid,
    }
    const year = new Date().getFullYear()
    const contestantRef = doc(firestore, 'contestants', id)
    const bongCollection = collection(firestore, 'contestants', id, 'bongs')

    await runTransaction(firestore, async (transaction) => {
        const newBongRef = doc(bongCollection)

        transaction.set(newBongRef, bong)
        transaction.update(contestantRef, {
            [`bongCount_${year}`]: increment(1),
        })
    })
}

export const clearOldField = async (id: string) => {
    const contestantDoc = doc(firestore, 'contestants', id)
    await updateDoc(contestantDoc, {
        bongCount: null,
    })
}

export const pauseContestant = async (id: string) => {
    const contestantDoc = doc(firestore, 'contestants', id)
    await updateDoc(contestantDoc, {
        pausedAt: serverTimestamp(),
    })
}
