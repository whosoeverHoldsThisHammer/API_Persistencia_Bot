import express from 'express'
import { getSessions, getSessionById, createSession, updateSession, updateActivity } from '../controllers/sessions.js'

const router = express.Router()

router.get("/", getSessions)
router.get("/:id", getSessionById)
router.post("/", createSession)
router.patch("/updateSession/:id", updateSession)
router.patch("/updateActivity/:id", updateActivity)


export default router