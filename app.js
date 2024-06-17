import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import Session from './model/session.js'
import getCurrentTime from './utils/time.js'
import generateRandomID from './utils/randomId.js'
import Conversation from './model/conversation.js'
import HumanMessage from './model/humanMessage.js'
import AiMessage from './model/aiMessage.js'

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


app.get("/sessions", async (req, res) => {
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


app.get("/sessions/:id", async (req, res)=> {
    
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

app.post("/sessions", async(req, res)=>{
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


app.patch("sessions/updateSession/:id", async(req, res)=>{
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


app.patch("sessions/updateActivity/:id", async(req, res)=>{
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


// Conversations

app.get("/conversations", async(req, res) => {
    try {
        const conversations = await Conversation.find()
        res.json(conversations)
    } catch(err) {
        res.json({
            message: err.message
        })
    }
})


app.post("/conversations", async(req, res)=>{
    const chatId = req.body.chat_id
    const userId = req.body.user_id
    const sessionId = req.body.session_id
  
    const conversation = new Conversation({
        chat_id: chatId,
        user_id: userId,
        session_id: sessionId,
        status: "open",
        messages: []
    })

    try {
        const newConversation = await conversation.save()
        // console.log(newConversation)
        res.json(newConversation)
    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
    
})


app.patch("/conversations/saveMessage", async(req, res)=>{
    // Para buscar el chat
    const chatId = req.body.chat_id
    const sessionId = req.body.session_id
    
    // Para crear el nuevo tupo de mensaje
    const role = req.body.role
    const messageId = req.body.message_id
    const content = req.body.content
    const date = req.body.date

    let message
    
    try {
        const conversation = await Conversation.findOne({
            chat_id: chatId,
            session_id: sessionId
        })
        
        if(conversation !== null){

            console.log("Encontró la conversación")

            if(role === "human"){

                message = new HumanMessage({
                    role: role,
                    message_id: messageId,
                    content: content,
                    date: date
                })
        
            } else if(role === "bot") {
                
                message = new AiMessage({
                    role: role,
                    message_id: messageId,
                    content: content,
                    date: date,
                    feedback: ""
                })
            }

            
            conversation.messages.push(message)
            await conversation.save();
            res.json(conversation)

        }
    }
    catch(err){
        res.json({
            message: err.message
        })
    }
    
})