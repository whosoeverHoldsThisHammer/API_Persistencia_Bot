import Session from '../model/session.js'
import getCurrentTime from '../utils/time.js'
import generateRandomID from '../utils/randomId.js'

const getSessions = async (req, res) => {

    try {
        const sessions = await Session.find()
        res.json(sessions)
    } catch(err) {
        res.json({
            message: err.message
        })
    }

}

const getSessionById = async (req, res) => {

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

}

const createSession = async (req, res) => {

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

}



export { getSessions, getSessionById, createSession }