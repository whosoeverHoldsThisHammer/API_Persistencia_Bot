import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import session from './model/session.js';

dotenv.config();
const app = express()


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Conectado a Mongo"))
.catch(err => console.log('Error de conexión', err))

const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', ()=> console.log("Conectado a la base de datos"))



const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server express levantado en el puerto ${PORT}`)
})


app.get("/", async (req, res) => {
    try {
        const sessions = await session.find()
        console.log(sessions)
        res.json(sessions)
    } catch(err) {
        console.log("error", err)
    }
})