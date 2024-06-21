import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    chat_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    session_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    messages: []
})


ConversationSchema.pre('save', function(next) {
    const document = this
    
    // La conversación también se guarda al actualizar feedback de mensajes antigüos
    // Podría haber un save de una conversación cerrada que dispara este trigger
    // Por eso consulta por el estado antes de hacer la operación

    if(document.status === "open"){
        setTimeout(()=>{
            const MAX_MINUTES = 30
            const lastMessage = document.messages[document.messages.length - 1]
            
            let last = (parseInt(lastMessage.date))
            let current = Date.now()

            const diff = Math.abs(current - last)
            const minutes = diff / (1000 * 60)

            if(minutes > MAX_MINUTES){      
                document.status = "closed"
                document.save()
            }
            
        }, 1800000)

    }

    next()
})


export default mongoose.model('Conversation', ConversationSchema)