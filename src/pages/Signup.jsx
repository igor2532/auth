import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
    if (password.length>5) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            console.log(userCredential);
            const user = userCredential.user;
            localStorage.setItem('token',user.accessToken);
            localStorage.setItem('user',JSON.stringify(user));
            navigate('/');
           }
           catch(error) {
               console.log(error)
           }
    }
   else {
    console.log('Пароль содержит менее 6 символов')
   }
        



    }
  return (
   <div>
    <h1>Signup</h1>
    <form onSubmit={handleSubmit} className='signup-form'>
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
        <button type='submit' className='signup-button'>Signup</button>


    </form>
    <div><NavLink to="/login">Login</NavLink></div>
    
   </div>
  )
}
