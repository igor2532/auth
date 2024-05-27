import React from 'react'
import { useLocation } from 'react-router-dom';
import Header from './Header';

export default function Product() {
  const location = useLocation();
  const {title,userEmail,image,price} = location.state.object
  return (
    <>
       <Header />
<div className='App_item_preview'>
    <div><img src={image}/></div>
    <div>{title}</div>
    <div>{userEmail}</div>
    <div>${price}</div>
</div>
    </>
 
  )
}
