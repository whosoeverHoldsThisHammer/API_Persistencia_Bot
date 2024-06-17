import mongoose from 'mongoose';

const HumanMessageSchema = new mongoose.Schema({
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
})

export default mongoose.model('HumanMessage', HumanMessageSchema)