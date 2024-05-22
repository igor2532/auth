import React from 'react'
import { signOut } from "firebase/auth";
import { auth,storage } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
export default function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login"); 
        navigate(0)
      };
  return (
    <header className="App_header">
    <div className="App_logo">
     <NavLink to='/'>
     <img src="https://cdn-icons-png.flaticon.com/512/6078/6078201.png" /> </NavLink>
    </div>
    <div className="App_functions">
      <button>Ваш email:{user.email} </button>
      <button onClick={handleLogout}>LogoutS</button>
    </div>
  </header>
  )
}
