import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
         const userCredential = await signInWithEmailAndPassword(auth,email,password);
         console.log(userCredential);
         const user = userCredential.user;
         localStorage.setItem('token',user.accessToken);
         localStorage.setItem('user',JSON.stringify(user));
         navigate("/");
        }
        catch(error) {
            console.log(error)

        }
    }
  return (
   <div>
    <h1>Login page</h1>
    <form  className='login-form'>
        <input 
        type='email'
        placeholder='Your email'
        required
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
               <input 
        type='password'
        placeholder='Your password'
        required
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className='login-button'>Login</button>
        <div><NavLink to="/signup">Signup</NavLink></div>
    </form>
   </div>
  )
}
