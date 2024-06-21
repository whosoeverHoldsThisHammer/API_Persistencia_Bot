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
    // Podría hacer un save de una conversación cerrada
    if(document.status === "open"){
        console.log("La conversación está abierta")
        setTimeout(()=>{
            const MAX_MINUTES = 1
            const lastMessage = document.messages[document.messages.length - 1]
            
            let last = (parseInt(lastMessage.date))
            let current = Date.now()

            const diff = Math.abs(current - last)
            const minutes = diff / (1000 * 60)

            console.log(minutes > MAX_MINUTES)
            if(minutes > MAX_MINUTES){
                console.log("Hay que cerrar la conversación")
            }
            
        }, 120000)

    } else {
        console.log("La conversación está cerrada")
    }
    

    next()
})


export default mongoose.model('Conversation', ConversationSchema)