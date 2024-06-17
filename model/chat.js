import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
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

export default mongoose.model('Chat', ChatSchema)