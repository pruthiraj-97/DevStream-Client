import CodeEditor from "./codeEditor"
import Output from "./output"
import UsersCompo from "./userSection"
import '../componentCSS/DashBoard.css'
import { useState,useEffect } from "react"
import { useParams ,useNavigate} from "react-router-dom"
import { useLocation } from 'react-router-dom';
import API from "../config/API"
import socket from '../config/socketIoClient'
import Loading from "./Loading"
const DashBoard=()=>{
    const { id }=useParams()
    const navigate=useNavigate()
    const location = useLocation();
    const [currentLanguage,setCurrentalanguage]=useState('javascript')
    const [currentCodeValue,setCurrentcodeValue]=useState('')
    const [userDetails,setUsetDetails]=useState(JSON.parse(localStorage.getItem('DevStreamUserDetails')) || null)
    const [dashboardDetails,setDashboardDetails]=useState({})
    const [isUserJoined,setIsUserJoined]=useState(false)
    const [isloading,setIsLoading]=useState(false)
    
    async function connectSocket(){
      console.log("socket after connection",socket)
      socket.emit('join_room',id,userDetails._id)
    }

    async function addUser(){
      const url=`${API.DOMAIN}/api/v1/dashboard/join/${id}`
       const response=await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'x-access-token':localStorage.getItem('DevStreamToken')
        }
       })
       const data=await response.json()
       setIsLoading(false)
       console.log(data)
    }
    
    // main logic this hook running multiple times
    useEffect(() => {
      const validateUserdetails = async () => {
        try {
          setIsLoading(true);
          const url = `${API.DOMAIN}/api/v1/auth/isautherize`;
          const token = localStorage.getItem('DevStreamToken');
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          });
          const data = await response.json();
          if (data.status === 401) {
            navigate('/login', {
              state: {
                dashboardId: id
              }
            });
          } else if (data.status === 200) {
            console.log("validate data is ", data);
            connectSocket();
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
    
      if (!userDetails || !userDetails._id) {
        navigate('/login', {
          state: {
            dashboardId: id
          }
        });
      } else {
        validateUserdetails();
      }
      
    }, []);
    


    useEffect(()=>{
      socket.on('room_joined',(message)=>{
        console.log('message after join',message)
        setIsUserJoined(true)
        console.log('isUserJoined',isUserJoined)
        addUser()
      })
    },[])



    function changeCurrentlanguage(language){
          setCurrentalanguage(language)
          console.log(currentLanguage)
          setCurrentcodeValue('')
    }
    function changeCurrentCode(code){
        setCurrentcodeValue(code)
    }
    
    if(isloading) return ( <Loading/> )


    return (
       <div className="Dashboard-div">
         <div className="Editor-output-div">
            <CodeEditor currentLanguage={currentLanguage} changeCurrentCode={changeCurrentCode} dashboardId={id}/>
            <Output changeCurrentlanguage={changeCurrentlanguage} currentCodeValue={currentCodeValue} dashboardId={id}/>
         </div>
         <div>
           <UsersCompo dashboardId={id} setIsLoading={setIsLoading}/>
         </div>
       </div>
    )
}

export default DashBoard