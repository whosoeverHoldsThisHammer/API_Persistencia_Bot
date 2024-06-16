import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    chat_id: {
        type: String,
        required: true
    },
    last_active : {
        type: String,
        required: true
    },
    session_id : {
        type: String,
        required: true
    }
})

export default mongoose.model('Session', SessionSchema)