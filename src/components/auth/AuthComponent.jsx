import React from 'react'

export default function AuthComponent() {
  return (
    <div className='App_form_auth'>
      <form onSubmit={()=>alert('submit form now...')}>
      <input placeholder='Login' type='text' /> 
      <input placeholder='Password' type='password' /> 
       <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
