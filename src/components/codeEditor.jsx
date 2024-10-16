import React, { useEffect, useState } from "react"
import Editor from '@monaco-editor/react';
import socket from "../config/socketIoClient";
import API from "../config/API";
const CodeEditor=({currentLanguage,changeCurrentCode,dashboardId})=>{
    const [codeValue,setCodeValue]=useState('')
    const [userDetails,setUserDetails]=useState(JSON.parse(localStorage.getItem('DevStreamUserDetails')))
    async function handleEditorChange(value){
        setCodeValue(value);
        changeCurrentCode(value)
        const url=`${API.DOMAIN}/api/v1/dashboard/updatecode/${dashboardId}`
        const response=await fetch(url,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':localStorage.getItem('DevStreamToken')
            },
            body:JSON.stringify({
                code:value
            })
        })
        const data=await response.json()
    };

    useEffect(()=>{
       async function fetchDashBoardData(){
        const url=`${API.DOMAIN}/api/v1/dashboard/${dashboardId}`
           const response=await fetch(url,{
               method:'GET',
               headers:{
                   'Content-Type':'application/json',
                   'x-access-token':localStorage.getItem('DevStreamToken')
               }
           })
           const data=await response.json()
           console.log(data)
           if(data.status==200){
              let code=data.data.dashboard.code
              console.log("code is",code)
              setCodeValue(code)
              changeCurrentCode(code)
           }
       }
       fetchDashBoardData()
    },[])



    useEffect(()=>{
      setCodeValue('')
    },[currentLanguage])
    useEffect(()=>{
       socket.on(`newcode${dashboardId}`,(message)=>{
        console.log("message is ",message)
        if(userDetails && message.id!=userDetails._id){
            setCodeValue(message.code)
            changeCurrentCode(message.code)
        }
       })
    },[])

    return <>
       <div >
            <Editor
                height="600px"
                width="1100px" 
                language={currentLanguage}
                theme="vs-dark"
                value={codeValue}
                onChange={handleEditorChange}
                options={{
                    suggest: true,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    autoIndent: 'full',
                }}
        />
       </div>
    </>
}

export default CodeEditor