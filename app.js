import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import Session from './model/session.js'
import getCurrentTime from './utils/time.js'
import generateRandomID from './utils/randomId.js'

dotenv.config();
const app = express()
app.use(express.json())

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
        const sessions = await Session.find()
        //console.log(sessions)
        res.json(sessions)
    } catch(err) {
        res.json({
            message: err.message
        })
    }
})


app.get("/:id", async (req, res)=> {
    
    const chatId = req.params.id
    let session

    try {
        session = await Session.findOne({ chat_id: chatId })
    } catch(err) {
        res.json({
            message: err.message
        })
    }

    res.json(session)
})

app.post("/", async(req, res)=>{
    const chatId = req.body.chat_id

    const session = new Session({
        chat_id: chatId,
        last_active: getCurrentTime(),
        session_id: generateRandomID()
    })

    try {
        const newSession = await session.save()
        res.json(newSession)
    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
    
})


app.patch("/updateSession/:id", async(req, res)=>{
    const chatId = req.params.id
    
    try {
        const session = await Session.findOne({ chat_id: chatId })

        if(session !== null){
            session.session_id = generateRandomID()
            session.last_active = getCurrentTime()
        }
 
        const updatedSession = await session.save()
        
        res.json(updatedSession)
    }
    catch(err){
        res.json({
            message: err.message
        })
    }

})


app.patch("/updateActivity/:id", async(req, res)=>{
    const chatId = req.params.id
    
    try {
        const session = await Session.findOne({ chat_id: chatId })

        if(session !== null){
            session.last_active = getCurrentTime()
        }
 
        const updatedSession = await session.save()
        
        res.json(updatedSession)
    }
    catch(err){
        res.json({
            message: err.message
        })
    }

})