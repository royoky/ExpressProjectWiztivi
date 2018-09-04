import app from './app.js'
import { db } from './db'

// starting server
(async function () {
    try {
        await db.connect('mongodb://localhost:27017/wiztivi', { useNewUrlParser: true })
        app.listen(5000), () => {
            console.log('server started')
        }
    } catch (error) {
        console.error(error)
        process.exit(1)      
    }
})()
