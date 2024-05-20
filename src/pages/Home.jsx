import { signOut} from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, database, storage} from '../firebase';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore,query, where } from 'firebase/firestore';
import { ref } from 'firebase/database';
import {  uploadBytes, uploadBytesResumable } from 'firebase/storage';
export default function Home() {
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const navigate = useNavigate();
const [array, setArray] = useState([]);
const [arrayAll, setArrayAll] = useState([]);
const [valueTitle, setValueTitle] = useState('');
const [valuePrice, setValuePrice] = useState('');
const [valueImage, setValueImage] = useState('');
const [file, setFile] = useState("");
const handleUpload = (event) => {
  event.preventDefault();
  const storageRef = ref(storage, `/files/${file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, file);
}
const categoryDocRef = doc(getFirestore(), "users",user.uid);
const handleInfo = async () => {
const q =  query(collection(getFirestore(), 'products'),where('userId', '==',categoryDocRef));
const all =  query(collection(getFirestore(), 'products'),where('userId', '!=',categoryDocRef));
const querySnapshot = await getDocs(q);
const querySnapshotAll = await getDocs(all);
const myArr = [];
const myArrAll = [];
querySnapshot.forEach((doc)=>{
  myArr.push(doc.data());
})
querySnapshotAll.forEach((doc)=>{
  myArrAll.push(doc.data());
})
setArray(myArr);
setArrayAll(myArrAll);
}
 
useEffect(()=>{
  handleInfo();
},[])

function handleChange(event) {
  setFile(event.target.files[0]);
}

const addProduct = async (event) => {
  event.preventDefault();
  const docRef = await addDoc(collection(getFirestore(),'products'),{
   title: valueTitle,
   price: valuePrice,
   image: valueImage,
   userId: categoryDocRef
  });
  handleInfo();
}

const handleLogout = async () => {
  await signOut(auth);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
   navigate('/login');
}
  return (
    <>
  { token &&
  <>

  <header className='App_header'>
  <div className='App_logo'><img src='https://cdn-icons-png.flaticon.com/512/6078/6078201.png'/> </div> 
   <div className='App_functions'>
   <button>Ваш email:{user.email} </button>
  <button onClick={handleLogout}>Logout</button>
    </div> 
    </header>
    <div className='App_form_for_add'>
        <form>
            <input onChange={(e)=>setValueTitle(e.target.value)}  placeholder='Enter title'/>
            <input onChange={(e)=>setValuePrice(e.target.value)} type='number'  placeholder='Enter price'/>
            <input onChange={(e)=>setValueImage(e.target.value)}  placeholder='Enter url image'/> 
            <input type="file" onChange={handleChange} />
                <button onClick={handleUpload}>Upload</button>
            <button onClick={addProduct}>Add product</button>
        </form>
    </div>
  <h2 className='h2_app'>Мои блюда</h2>
  <div className='App_items'>
    {
      array.map((item,key)=>(
        <>
        <div key={key}> 
        <img src={item.image}/>
          <span>{item.title}</span>    
          <span>{item.price}</span>
        </div>
        </>
      ))
    }
  </div>


 
    <h2 className='h2_app'>Блюда других поваров</h2>
    <div className='App_items_all'>
    {
      arrayAll.map((item,key)=>(
        <>
        <div key={key}> 
        <img src={item.image}/>
          <span>{item.title}</span>    
        </div>
        </>
      ))
    }
  </div>
 
 </>
}
</>
  )
}
