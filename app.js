import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cors from 'cors'
import routerMaster from './routes/index.js'
import Conversation from './model/conversation.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(routerMaster)

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