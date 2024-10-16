import { io } from 'socket.io-client'
import API from './API'
const socket=io(API.DOMAIN)

socket.on('connect',()=>{
    
})

export default socket