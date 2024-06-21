import express from 'express'
import { getConversations, getConversationBySessionId, createConversation, saveMessages, saveFeedback, getMessages } from '../controllers/conversations.js'

const router = express.Router()

router.get("/", getConversations)
router.get("/findBySessionId/:id", getConversationBySessionId)
router.post("/", createConversation)
router.patch("/:id/:sessionId/saveMessage", saveMessages)
router.patch("/:id/:message_id/saveFeedback", saveFeedback)
router.get("/:id/:sessionId/messages", getMessages)


export default router