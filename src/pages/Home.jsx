import { signOut } from 'firebase/auth';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase';

export default function Home() {
const user = JSON.parse(localStorage.getItem('user'));
const navigate = useNavigate();
const handleLogout = async () => {
  await signOut(auth);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
   navigate('/login');
}
  return (
    <div>

<h1>Welcome</h1>
<h1>{user.email}</h1>

<button onClick={handleLogout}>Logout</button>

    </div>
  )
}
