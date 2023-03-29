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
    const bongUser = {
        uid,
        bongCount: 0,
    }
    addDoc(contestantCollection, bongUser)
}

export const registerBong = async (id: string, uid: string) => {
    const bong = {
        timestamp: serverTimestamp(),
        uid,
    }
    const bongCollection = collection(firestore, 'contestants', id, 'bongs')
    const promise1 = addDoc(bongCollection, bong)
    const promise2 = updateDoc(doc(firestore, 'contestants', id), {
        bongCount: increment(1),
    })
    await Promise.all([promise1, promise2])
}

export const pauseContestant = async (id: string, uid: string) => {
    const contestantDoc = doc(firestore, 'contestants', id)
    await updateDoc(contestantDoc, {
        pausedAt: serverTimestamp(),
    })
}
