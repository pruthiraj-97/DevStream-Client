import React, { useEffect, useState } from "react"
import '../componentCSS/output.css'
import API from "../config/API"
import TrueOutPut from "./trueOutPut"
import FalseOutPut from "./falseOutPut"
import socket from "../config/socketIoClient"
const Output=({changeCurrentlanguage,currentCodeValue,dashboardId})=>{
    const [currentlanguage,setCurrentLanguage]=useState('javascript')
    const [result,setResult]=useState('')
    const [loading,setLoading]=useState(false)
    const [userDetails,setuserDetails]=useState(JSON.parse(localStorage.getItem('DevStreamUserDetails')))
    const [showCopyIcon,setShowCopyIcon]=useState(false)
    const [copyContent,setCopyContent]=useState('copy')
    const [compileResultStatus,setCompileResultStatus]=useState(false)
    const supportedLanguages=[
            "javascript",
            "python"
        ]
     function HandleCopyUrl(e){
        e.preventDefault()
        let url=window.location.href;
        let splitUrl=url.split('/')
        let meetingId=splitUrl[splitUrl.length-1]
        navigator.clipboard.writeText(meetingId)
        .then(() => {
            console.log('Meeting ID copied to clipboard:', meetingId);
            setCopyContent('copied')
        })
        .catch(err => {
            console.error('Failed to copy the Meeting ID: ', err);
            setCopyContent('error')
        });
     }

     function HandleMouseEnter(e){
        setShowCopyIcon(true)
        setCopyContent('copy')
     }

     function HandleLanguageChange(e){
       e.preventDefault()
       setCurrentLanguage(e.target.value)
       changeCurrentlanguage(e.target.value)
     }

    async function HandleRunCode(e){
        e.preventDefault()
        setLoading(true)
        setResult(null)
        console.log(currentCodeValue,currentlanguage)
        const url=`${API.DOMAIN}/api/v1/dashboard/compile/${dashboardId}`
        const response=await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('DevStreamToken')
            },
            body:JSON.stringify({
                code:currentCodeValue,
                language:currentlanguage
            })
        })
        const data=await response.json()
        console.log("compilcation result is ",data)
        if(data.status==200){
            if(data.data){
                if(data.data.isExecutionSuccess){
                    setCompileResultStatus(true)
                }else{
                    setCompileResultStatus(false)
                }
                setResult(data.data.output)
            }
        }
        setLoading(false)
    }

    useEffect(()=>{
       socket.on(`compilationResult${dashboardId}`,(message)=>{
           console.log('message result ',message)
           if(userDetails && message.userDetails.id!=userDetails._id){
               setCurrentLanguage(message.language)
               if(message.compilationResult.isExecutionSuccess){
                  setCompileResultStatus(true)
                  setResult(message.compilationResult.output)
               }else{
                setCompileResultStatus(false)
                setResult(message.compilationResult.output)
               }
           }
           setLoading(false)
       })

       socket.on(`compilation_start${dashboardId}`,(message)=>{
          console.log('message ',message,userDetails)
          if(userDetails && message.userDetails.id!=userDetails._id){
              setLoading(true)
          }
       })

    },[socket])

    console.log('result is ',result)
    return (
        <div className="Output-Div">
          {
            !loading && (
                <div className="language-selector">
               <select onChange={HandleLanguageChange} value={currentlanguage}>    
                {
                    supportedLanguages.map((language, index) => {
                        return (
                            <option key={index} value={language}>
                                {language}
                            </option>
                        );
                    })
                }
            </select>
            <button onClick={HandleRunCode}>RUN</button>
            <button className="copyurl-button"
               onMouseEnter={HandleMouseEnter}
               onMouseLeave={(e)=>setShowCopyIcon(false)}
               onClick={HandleCopyUrl}
            >MeetingId</button>
            {
                showCopyIcon && <p className="copy-para">{copyContent}</p>
            }
       </div>
            )
          }
       <div>
        {
            result && result.length>0 && (compileResultStatus ? <TrueOutPut data={result} /> : <FalseOutPut data={result} />) 
        }
       </div>
   
</div>
      
    )
}

export default Output