import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, getDocs, getFirestore,query, setDoc, where } from 'firebase/firestore';
export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isErrorForm, setIsErrorForm] = useState(false)
    const handleAddUser = async (uid) => {
        const docRefA = doc(collection(getFirestore(),'users'),uid); 

        const newDocRefA = await setDoc(docRefA,{
            email: email,
           });
    

    }
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
            console.log(user.uid)
            handleAddUser(user.uid);   
        }
           catch(error) {
            setIsErrorForm(true)
               console.log(error)
           }
    }
   else {
    console.log('Пароль содержит менее 6 символов')
   }
        



    }
  return (
   <div>
    <h1 className='App_loginH1'>Регистрация</h1>
    <form className='login-form' onSubmit={handleSubmit} >
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
        <button type='submit' className='login-button'>Signup</button>


    </form>
   
   {
    isErrorForm &&
<div className='App_error_form'>
<span>Ошибка, либо такой пользователь существует.</span>
</div>
   }

    <div className='App_other'>
    <div><NavLink to="/login">Login</NavLink></div>
    </div>
    
   </div>
  )
}
