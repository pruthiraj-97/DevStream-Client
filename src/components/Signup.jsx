import React, { useState } from 'react';
import '../componentCSS/Signup.css';
import API from '../config/API';
import { useNavigate,Link } from 'react-router-dom';
const Signup = () => {
    const Navigate=useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error,setError]=useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        try {
            const url=`${API.DOMAIN}/api/v1/auth/register`
            const response=await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    ...formData
                }),
            })
            const data=await response.json()
            console.log(data)
            if(data.status==200){
                Navigate('/login')
            }else if(data.status==400){
                
            }
        } catch (error) {
            throw Error
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
                <p className='signup-text'>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;
