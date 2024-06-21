import Conversation from '../model/conversation.js'

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


export { getConversations }