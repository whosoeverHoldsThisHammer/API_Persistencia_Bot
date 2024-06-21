import { Router } from 'express'
import conversationRoutes from './conversations.js'

const routerMaster = Router()  

routerMaster.use('/conversations', conversationRoutes)

export default routerMaster