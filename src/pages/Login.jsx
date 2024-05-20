import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth, signInWithGooglePopup } from '../firebase';
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



    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        localStorage.setItem('token',response.user.accessToken);
        localStorage.setItem('user',JSON.stringify(response.user));
        navigate("/");
    }




  return (
   <div>
    <h1 className='App_loginH1'>Авторизация</h1>
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
    
    </form>
    <div className='App_other'>
    <div><NavLink to="/signup">Signup</NavLink></div>
        <div>
            <button className='App_form_button_google' onClick={logGoogleUser}>Sign In With Google</button>
        </div>
    </div>
   </div>
  )
}
