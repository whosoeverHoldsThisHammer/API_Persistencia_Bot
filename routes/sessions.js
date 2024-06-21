import express from 'express'
import { getSessions, getSessionById, createSession } from '../controllers/sessions.js'

const router = express.Router()

router.get("/", getSessions)
router.get("/:id", getSessionById)
router.post("/", createSession)


export default router