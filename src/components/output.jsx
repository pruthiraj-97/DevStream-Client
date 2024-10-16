import React, { useEffect, useState } from "react"
import '../componentCSS/output.css'
import API from "../config/API"
import TrueOutPut from "./trueOutPut"
import FalseOutPut from "./falseOutPut"
import socket from "../config/socketIoClient"
const Output=({changeCurrentlanguage,currentCodeValue,dashboardId})=>{
    const [currentlanguage,setCurrentLanguage]=useState('javascript')
    const [result,setResult]=useState(null)
    const [loading,setLoading]=useState(false)
    const [userDetails,setuserDetails]=useState(JSON.parse(localStorage.getItem('DevStreamUserDetails')))
    const supportedLanguages=[
            "javascript",
            "python"
        ]
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
                setResult(data.data)
            }
        }
        setLoading(false)
    }

    useEffect(()=>{
       socket.on(`compilationResult${dashboardId}`,(message)=>{
           console.log("result message isn ",message)
           if(userDetails && message.userDetails.id!=userDetails._id){
               setLoading(false)
               setResult(message.compilationResult)
           }
       })

       socket.on(`compilation_start${dashboardId}`,(message)=>{
          console.log('message ',message,userDetails)
          if(userDetails && message.userDetails.id!=userDetails._id){
              setLoading(true)
          }
       })
    },[])
    
    return (
        <div className="Output-Div">
          {
            !loading && (
                <div className="language-selector">
               <select onChange={HandleLanguageChange}>    
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
       </div>
            )
          }
       <div>
        {
            result && result.isExecutionSuccess && <TrueOutPut data={result.output.toString()}/>
        }
        {
            result && !result.isExecutionSuccess && <FalseOutPut data={result.output.toString()}/>
        }
       </div>
   
</div>
      
    )
}

export default Output