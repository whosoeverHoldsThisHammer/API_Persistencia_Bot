import { Router } from 'express'
import sessionRoutes from './sessions.js'
import conversationRoutes from './conversations.js'

const routerMaster = Router()  

routerMaster.use('/sessions', sessionRoutes)
routerMaster.use('/conversations', conversationRoutes)

export default routerMaster