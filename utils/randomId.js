import { randomUUID } from 'crypto'

const generateRandomID = ()=> {
    return randomUUID()
}

export default generateRandomID