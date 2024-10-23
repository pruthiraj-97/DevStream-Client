import React, { useEffect, useState } from "react";
import '../componentCSS/userSection.css';
import socket from '../config/socketIoClient';
import UserSection from "./usercompo";
import API from "../config/API";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const UsersCompo = ({ dashboardId,setIsLoading }) => {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('DevStreamUserDetails')));
  const navigate = useNavigate();

  function HandleAuthenticate(TYPE) {
    if (TYPE === 'REGISTER') {
      navigate('/signup');
    } else if (TYPE === 'LOGIN') {
      navigate('/login');
    }
  }

  async function HandleleaveFunction(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      socket.emit('leave_room', dashboardId);
      
      const url = `${API.DOMAIN}/api/v1/dashboard/leave/${dashboardId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('DevStreamToken')
        },
      });
      const data = await response.json();
      setIsLoading(false);
      
      if (data.status === 200) {
        navigate('/');
      } else if (data.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.log('Error in leave room:', error);
      setIsLoading(false);
    }
  }

  function HandleAuth(TYPE){
    return ()=>{
      if(TYPE=='LOGIN'){
        navigate('/login')
      }else if(TYPE=='SIGNUP'){
        navigate('/signup')
      }
    }
  }

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const url = `${API.DOMAIN}/api/v1/dashboard/collaborators/${dashboardId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('DevStreamToken')
          }
        });
        const data = await response.json();
        console.log("data users ",data)
        if (data.status === 200) {
          setUsers(data.data.collaborators);
        } else if (data.status === 401) {
          navigate('/login');
        }
      } catch (error) {
        console.log('Error fetching collaborators:', error);
      }
    }
    fetchCollaborators();
  }, []);

  useEffect(() => {
    socket.on(`newuser${dashboardId}`, (message) => {
      console.log("message of new user is:", message);
      const newUser = {
        name: message.name,
        email: message.email,
        _id: message.id 
      };
        setUsers((prevUsers) => {
          const existingUserIndex = prevUsers.findIndex((user) => user._id === newUser._id);

          if (existingUserIndex !== -1) {
            const updatedUsers = [...prevUsers];
            updatedUsers[existingUserIndex] = newUser;
            return updatedUsers;
          } else {
            return [...prevUsers, newUser];
          }
        });
    });

    socket.on(`leaveMessage${dashboardId}`, (message) => {
      console.log('leave message is:', message);
      setUsers(message.result.collaborators); 
    });
    

    // return () => {
    //   socket.off(`newuser${dashboardId}`);
    //   socket.off(`leaveMessage${dashboardId}`);
    // };
  }, [dashboardId, userDetails]);


  return (
    <div className="UserContainer-div">
      <div className="UserList-div">
        {users.map((item, index) => (
          <UserSection key={index} name={item.name} id={item._id} />
        ))}
      </div>
      
      <div className="Other-section">
        <button className="leave-button" onClick={HandleleaveFunction}>
          Leave
        </button>
        <button onClick={HandleAuth('LOGIN')} className="LOGIN-BUTTON">Login</button>
        <button onClick={HandleAuth('SIGNUP')} className="LOGIN-BUTTON">SignUp</button>
      </div>
    </div>
  );
};

export default UsersCompo;
