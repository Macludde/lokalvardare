import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

console.log(process.env)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
}

const app = initializeApp(firebaseConfig)

export default app

export const db = getFirestore(app)
