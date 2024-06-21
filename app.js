import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Session from './model/session.js'
import getCurrentTime from './utils/time.js'
import generateRandomID from './utils/randomId.js'
import Conversation from './model/conversation.js'
import HumanMessage from './model/humanMessage.js'
import AiMessage from './model/aiMessage.js'

dotenv.config()
const app = express()
app.use(cors())
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


app.patch("/sessions/updateSession/:id", async(req, res)=>{
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


app.patch("/sessions/updateActivity/:id", async(req, res)=>{
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
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 100
    const offset = (page - 1) * limit

    try {
        const conversations = await Conversation.find()
        .skip(offset)
        .limit(limit)
        
        res.json(conversations)
    } catch(err) {
        res.json({
            message: err.message
        })
    }
})


app.get("/conversations/findBySessionId/:id", async(req, res) => {
    const sessionId = req.params.id

    try {
        const conversation = await Conversation.findOne({ session_id: sessionId })
        res.json(conversation)
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
        res.json(newConversation)
    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
    
})


app.patch("/conversations/:id/:sessionId/saveMessage", async(req, res)=>{
    // Para buscar el chat
    const chatId = req.params.id
    const sessionId = req.params.sessionId
    
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

            // console.log("Encontró la conversación")

            if(role === "human"){

                message = new HumanMessage({
                    role: role,
                    message_id: messageId,
                    content: content,
                    date: date
                })
        
            } else if(role === "ai") {
                
                message = new AiMessage({
                    role: role,
                    message_id: messageId,
                    content: content,
                    date: date,
                    feedback: "None"
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

app.patch("/conversations/:id/:message_id/saveFeedback", async(req, res)=>{
    // Para buscar el chat
    const chatId = req.params.id
    const messageId = req.params.message_id

    // Para obtener el feedback
    const feedback = req.body.feedback

    try {
        const conversation = await Conversation.findOne({ chat_id: chatId, "messages.message_id": messageId})

        if(conversation != null){
            let message = conversation.messages.find(message => message.message_id === messageId)
            
            message.feedback = feedback

            conversation.markModified('messages')

            const savedConversation = await conversation.save()
            res.json(savedConversation)
            
        }

    } catch(err){
        res.json({
            message: err.message
        })
    }
})


app.get("/conversations/:id/:sessionId/messages", async(req, res)=>{

    const DEFAULT = 4

    // Para buscar el chat
    const chatId = req.params.id
    const sessionId = req.params.sessionId

    // Trae la cantidad de mensajes solicitadas en el query o sino los últimos 4
    const limit = parseInt(req.query.limit) || DEFAULT

    try {
        const conversation = await Conversation.findOne({ chat_id: chatId, session_id: sessionId})

        if(conversation != null){
            
            if (conversation.messages && conversation.messages.length > 0) {

                const messages = conversation.messages
                const index = Math.max(messages.length - limit, 0);
                const lastMessages = messages.slice(index);
                
                res.json(lastMessages)


            } else {
                res.json([])    
            }
            
        }

    } catch(err){
        res.json({
            message: err.message
        })
    }
    
})