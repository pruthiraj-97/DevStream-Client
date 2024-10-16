import React from "react"
import '../componentCSS/usercompo.css'
function UserSection({name,email,id}){
    console.log(name,email,id)
    return (
        <div className="userdetails-div">
         <div className="circle">{name[0].toUpperCase()}</div>
         <p className="user-name">{name}</p>
    </div>
    )
}

export default UserSection