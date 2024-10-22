import React, { useState } from 'react';
import '../componentCSS/Home.css';
import API from '../config/API';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
const Home = () => {
    const navigator=useNavigate()
    const [isLoading,setIsLoading]=useState(false)
    const [meetingId,setMettingId]=useState('')
    async function handleCreateNewSession(e){
        try {
            e.preventDefault()
            const url=`${API.DOMAIN}/api/v1/dashboard/createdashboard`
            const token=localStorage.getItem('DevStreamToken')
            console.log("token is ",token)
            setIsLoading(true)
            console.log("start crearting")
            const response=await fetch(url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    'x-access-token':token
                },
            })
            const data=await response.json()
            console.log(data)
            setIsLoading(false)
            if(data.status==200){
                const id=data.data.dashboard._id
                navigator(`/dashboard/${id}`, {
                    state: data.data.dashboard
                })
            }else if(data.status==401){
                navigator('/login')
            }else if(data.status==500){
                throw Error
            }
        } catch (error) {
            console.log("error is ",error)
            throw Error
        }
    }

    function HandleMeetingJoin(e){
        e.preventDefault()
        navigator(`/dashboard/${meetingId}`)
    }
   
    if(isLoading){
        return (
          <Loading/>
        )
    }

    return (
        <div>
            <div className="home-container">
            <h1 className="home-title">Welcome to Dev Stream</h1>
            <img src="https://www.augmentedmind.de/wp-content/uploads/2020/06/collaborative-editor-feature.jpg" alt="Collaborators" className="home-collaborator-image" />
            <p className="home-description">
                Your platform for real-time coding collaboration with friends and teammates. 
                Work together seamlessly, share ideas, and enhance your coding skills!
            </p>
            <button className="home-start-button"
               onClick={handleCreateNewSession}
            >Start a New Session</button>
            <div className='meeting-join'>
                <input type="text" placeholder='Enter meeting id' onChange={(e)=>setMettingId(e.target.value)}/>
                <button 
                   onClick={HandleMeetingJoin}
                >Join</button>
            </div>
        </div>
        </div>
    )
};

export default Home;

