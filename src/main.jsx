import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import LoginComponent from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Home from './components/Home.jsx'
import Loading from './components/Loading.jsx'  
import DashBoard from './components/Dashboard.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginComponent/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/dashboard/:id' element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
