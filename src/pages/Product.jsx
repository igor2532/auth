import React from 'react'
import { useLocation } from 'react-router-dom';
import Header from './Header';

export default function Product() {
  const location = useLocation();
  return (
    <>
       <Header />
    <div>{location.state.object}</div>
    </>
 
  )
}
