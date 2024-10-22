import React from "react"
import { Link } from "react-router-dom"
function Header(){
    return (
        <div className="Header-Div">
            <div className="Logo-Section">
                <p>Dev Stream</p>
            </div>
            <div className="Auth-Section">
              <Link to={'/login'}>Login</Link>
              <Link to={'/signup'}>Login</Link>
            </div>
        </div>
    )
}

export default Header