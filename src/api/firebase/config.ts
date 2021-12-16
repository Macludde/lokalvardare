import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: 'lokalvardare-54743.firebaseapp.com',
    projectId: 'lokalvardare-54743',
    storageBucket: 'lokalvardare-54743.appspot.com',
    messagingSenderId: '355231012187',
    appId: '1:355231012187:web:83ade7eefc282ec190f67e',
}

const app = initializeApp(firebaseConfig)

export default app

export const db = initializeFirestore(app, { ignoreUndefinedProperties: true })
