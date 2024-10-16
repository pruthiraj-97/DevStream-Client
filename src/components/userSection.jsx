import React, { useEffect, useState } from "react"
import '../componentCSS/userSection.css'
import socket from '../config/socketIoClient'
import UserSection from "./usercompo"
import API from "../config/API"
import { useNavigate } from "react-router-dom"
const UsersCompo=({dashboardId})=>{
   const [users,setUsers]=useState([])
   const [userDetails,setuserDetails]=useState(JSON.parse(localStorage.getItem('DevStreamUserDetails')))
   const navigator=useNavigate()

   function isUserExist(uid){
      let ids=[]
      console.log("user ",users)
      users.forEach((item)=>{
        console.log("item is ",item)
         ids.push(item._id)
      })
      console.log("id are ",ids)
      return ids.includes(uid)
   }

   useEffect(()=>{
      async function fetchCollaborators(){
         const url=`${API.DOMAIN}/api/v1/dashboard/collaborators/${dashboardId}`
         const response=await fetch(url,{
            method:'GET',
            headers:{
               'Content-Type':'application/json',
               'x-access-token':localStorage.getItem('DevStreamToken')
            }
         })
         const data=await response.json()
         if(data.status==200){
            setUsers(data.data.collaborators)
         }else if (data.status==401){
            navigator('/login')
         }
      }
      fetchCollaborators()
   },[])
   useEffect(()=>{
      socket.on(`newuser${dashboardId}`,(message)=>{
         console.log("message of newuser is ",message)
         const newUser={
            name:message.name,
            email:message.email,
            _id:message.id
         }
         if(newUser._id!=userDetails._id){
            if(!isUserExist(newUser._id)) setUsers((prevUsers) => [...prevUsers, newUser]);
         }
      })
   },[])

    return (
       <div className="UserContainer-div">
          <div className="UserList-div">
               {
                  users.map((item,index)=>{
                     return (
                     <UserSection key={index} name={item.name} email={item.email} id={item._id}/>
                  )
                  })
               }
          </div>
       </div>
    )
}

export default UsersCompo