var admin = require('firebase-admin')

const serviceAccount = require('./serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lokalvardare-54743.firebase.io/',
    storageBucket: 'lokalvardare-54743.appspot.com',
})

const db = admin.database()
const storage = admin.storage().bucket()

const moveImages = async () => {
    const [files] = await storage.getFiles({
        maxResults: 1000,
    })
    files.forEach((file) => {
        const filePath = file.name
        const length = filePath.split('/').length
        if (length > 3) return
        console.log(file.name)
        // file.copy(filePath + '/unnamedFile')
        // file.delete()
    })
}
moveImages()
