import Conversation from '../model/conversation.js'
import HumanMessage from '../model/humanMessage.js'
import AiMessage from '../model/aiMessage.js'


const getConversations = async (req, res) => {

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
}


const getConversationsByChatId = async (req, res) => {

    const chatId = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 100
    const offset = (page - 1) * limit
    let order = {}

    switch (req.query.order) {
        case 'asc':
            order = 1
            break;
        case 'des':
            order = -1
            break;
        default:
            order = 1
            break;
    }

    try {
        const conversations = await Conversation.find({ chat_id: chatId })
        .skip(offset)
        .limit(limit)
        .sort({ _id: order })

        res.json(conversations)
    } catch(err) {
        res.json({
            message: err.message
        })
    }

}

const getConversationBySessionId = async (req, res) => {

    const sessionId = req.params.id

    try {
        const conversation = await Conversation.findOne({ session_id: sessionId })
        res.json(conversation)
    } catch(err) {
        res.json({
            message: err.message
        })
    }

}


const createConversation = async (req, res) => {
    
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
    
}

const saveMessages = async (req, res) => {

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

}

const saveFeedback = async (req, res) => {

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

}


const getMessages = async (req, res) => {

    const DEFAULT = 8

    // Para buscar el chat
    const chatId = req.params.id
    const sessionId = req.params.sessionId

    // Trae la cantidad de mensajes solicitadas en el query o sino los últimos 8
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
}


export { 
    getConversations,
    getConversationsByChatId,
    getConversationBySessionId,
    createConversation,
    saveMessages,
    saveFeedback,
    getMessages
}