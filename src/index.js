import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, RouterProvider, createBrowserRouter, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Protected from './components/Protected';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import Chat from './pages/Chat';
import Product from './pages/Product';
const token = localStorage.getItem('token');
const router = createHashRouter(
  createRoutesFromElements(
  <Route path='/' element={  <App />}>
 <Route path='/signup' element={!token ?<Signup />:<Home/>}/>
 <Route path='/login' element={!token ?<Login />:<Home />}/>
 <Route path='/user' element={<UserPage />}/>
 <Route path='/chat' element={<Chat />}/>
 <Route path='/product' element={<Product />}/>
 <Route path='/' element={<Protected />}>
 <Route path='/' index element={<Home />}/> 
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
