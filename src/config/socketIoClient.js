import { io } from 'socket.io-client'
import API from './API'
import axios from 'axios'
const socket=io(API.DOMAIN)

socket.on('connect',()=>{
    console.log('socket connected')
})

export default socket 

export async function BackgroundFetch(url,method,headers,body){
    console.log(url,method,headers,body)
    try {
        const response=await axios({
             url:url,
             method:method,
             headers:{...headers},
             body:{...body}
        })
        const data=await response.data()
        return data
    } catch (error) {
        throw error
     } 
    }