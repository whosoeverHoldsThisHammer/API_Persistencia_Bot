import mongoose from 'mongoose';

const AiMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    message_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    feedback: {
        type: Boolean,
        required: false
    }
})

export default mongoose.model('AiMessage', AiMessageSchema)