import React, { useState } from 'react'

export default function RegisterComponent() {
  const [valueLogin, setValueLogin] = useState('');
  const [valuePassword1, setValuePassword1] = useState('');
  const [valuePassword2, setValuePassword2] = useState('');

  const sendForm = (event) => {
    event.preventDefault();
    if (valuePassword1 == valuePassword2) {

      fetch(`http://localhost:3001/insert`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({valueLogin, valuePassword1}),
      }).then((response)=> response.json()).then((response)=>{
        
    
      })
    }
    else {
      alert('Не совпадают логин и пароль')
    }

   
    


  }
  return (
    <div className='App_form_register'>
      <form >
      <input onChange={(e)=>setValueLogin(e.target.value)}  placeholder='Login' type='text' /> 
      <input onChange={(e)=>setValuePassword1(e.target.value)} placeholder='Password1' type='password' /> 
      <input onChange={(e)=>setValuePassword2(e.target.value)} placeholder='Password2' type='password' /> 
       <button onClick={(event)=>sendForm(event)}>Register now...</button>
      </form>
    </div>
  )
}
