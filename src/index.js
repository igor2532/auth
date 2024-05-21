import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Protected from './components/Protected';
import Home from './pages/Home';
const token = localStorage.getItem('token');
const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path='/auth' element={  <App />}>
 <Route path='/auth/signup' element={!token ?<Signup />:<Home/>}/>
 <Route path='/auth/login' element={!token ?<Login />:<Home />}/>
 <Route path='/auth' element={<Protected />}>
 <Route path='/auth' index element={<Home />}/>
 </Route>
 



    </Route>
   

  )
)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
