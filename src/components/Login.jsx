import React, { useEffect, useState } from 'react';
import '../componentCSS/Login.css';
import API from '../config/API';
import { Link ,useNavigate,useLocation } from 'react-router-dom';
const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dashboardId,setDashboardId]=useState('')
    const location=useLocation()
    const navigator=useNavigate()
    useEffect(()=>{
       if(location.state){
        setDashboardId(location.state.dashboardId)
       }
    },[])
    const handleLogin = async (e) => {
        try {
            e.preventDefault()
            console.log('Email:', email);
            console.log('Password:', password);
            const url=`${API.DOMAIN}/api/v1/auth/login`
            const response=await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email,password})
        })
        const data=await response.json();
        console.log(data)
        if(data.status==200){
            const userdetails=data.data.user
            const token=data.data.token
            localStorage.setItem('DevStreamUserDetails',JSON.stringify(userdetails))
            localStorage.setItem('DevStreamToken',token)
            if(dashboardId){
                navigator(`/dashboard/${dashboardId}`)
            }else{
                navigator('/')
            }
        }else if(data.status==400){
            console.log("error is ",data)
        }
        } catch (error) {
            throw error
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" >
                <h2 className="login-title">Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="login-button" onClick={handleLogin}>Login</button>
                <p className='login-text'>Don't have an account? <Link to={"/signup"}>Signup</Link></p>
            </form>
        </div>
    );
};

export default LoginComponent;
