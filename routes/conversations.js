import express from 'express'
import { getConversations } from '../controllers/conversations.js'

const router = express.Router()

router.get("/", getConversations)


export default router