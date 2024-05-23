import React, { useEffect, useId, useMemo, useState } from "react";
import Header from "./Header";
import { NavLink, useLocation } from "react-router-dom";
import { auth, storage } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref as sRef } from "firebase/storage";
import { and } from "firebase/firestore/lite";
import { v4 } from "uuid";

export default function Chat() {
   
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [messagesArray, setMessagesArray] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [pageXValue, setPageXValue] = useState('');
  const [pageYValue, setPageYValue] = useState('');
  const [isContext, setIsContext] = useState(false);
  const [deleteIdItem, setDeleteIdItem] = useState('');
  const userId = token
    ? doc(getFirestore(), "users", location.state.userId)
    : "";
    

  const recipient = token ? doc(getFirestore(), "users", user.uid) : "";


 const handleDeleteItem = async () => {
const defRef = doc(getFirestore(), 'messages', deleteIdItem.id);
await deleteDoc(defRef);
console.log(defRef);
setIsContext(false);
handleInfo();
 }


  const handleInfo = async () => {
    // console.log('userid  '+location.state.userId);
    //  console.log('rece  '+user.uid)
    const q = query(
      collection(getFirestore(), "messages"),
      orderBy('date','asc'),
      //  or(
      //    where('recipient', '==',recipient, '&&','userId', '==',userId),
      //   where('recipient', '==',userId, '&&','userId', '==',recipient)
      //  ), 
      where('recipient', 'in' ,[userId, recipient], 'AND','userId', 'in',[recipient,userId], 'AND' , 'deleted', '==', false),

    // where('recipient', '==',recipient, '&&','userId', '==',userId),
      
    );
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot)
    const myMessages = [];
    querySnapshot.forEach((myDoc) => {
      const obj = myDoc.data();
    
        myMessages.push({userEmail: location.state.userEmail, ...obj });
     
     
    //   console.log(obj);
    });

    console.log(messagesArray.length==myMessages.length)
    if(messagesArray.length<myMessages.length) {
       // 
    }
    else {
        // console.log(messagesArray.length==myMessages.length);
        // console.log(messagesArray.length+" "+myMessages.length);
        const app_ul_id =  document.getElementById('App_messages_ul');
        app_ul_id.scrollTo(0,2000000000)
    }
    
    setMessagesArray(myMessages);
    if (!isLoad) {
        setIsLoad(true);
    }
  };



  const sendMessage = async (event) => {
    event.preventDefault();

    // addDoc(collection(getFirestore(), "messages"), {
      
    //   userId: userId,
    //   recipient: recipient,
    //   text: textValue,
    //   deleted: false,
    //   date:new Date().toLocaleString()
    // });
    const myUi = messagesArray.length+''+v4();
    const docRefA = doc(collection(getFirestore(),'messages'),myUi); 

    const newDocRefA = await setDoc(docRefA,{
      id: myUi,
         userId: userId,
      recipient: recipient,
      text: textValue,
      deleted: false,
      date:new Date().toLocaleString()
       });

    handleInfo()
    setTextValue('')
  
  };


// useMemo( ()=>{
       
// },[])
const changeMousePosition = (event) =>{
    if(!isContext) {
        setPageXValue(event.pageX);
        setPageYValue(event.pageY);   
    }
    
}
  const isContextActivate = (event,item) => {
    event.preventDefault();
    console.log(item)
    setIsContext(true);
    setDeleteIdItem(item);
    console.log(deleteIdItem.id)
  }
  

  useEffect(() => {
     handleInfo();
    const app_ul_id =  document.getElementById('App_messages_ul');
    app_ul_id.scrollTo(0,2000000000)

  }, [isLoad]);

  return (
    <>


      <Header />
      <div    className="App_userPage" onClick={()=>handleInfo()}>Chat with {location.state.userEmail}</div>
      <div style={{position:'absolute', top:`${pageYValue}px`,left:`${pageXValue}px`,display:isContext?'block':'none'}}>
          <ul className="App_contextMenu">
            <li>Edit</li>
            <li>Copy</li>
            <li onClick={handleDeleteItem}>Delete</li>
          </ul>
        </div>
      <div onClick={()=>{setIsContext(false)}} onMouseMove={changeMousePosition} className="App_messages">
        <ul  onClick={()=>{setIsContext(false)}} id="App_messages_ul">
        {!isLoad && (
            <div className="App_loading">
              <span className="loader"></span>
            </div>
          )}
          {
          isLoad &&
          messagesArray.map((item, key) => (
          (item.userId.id == location.state.userId || item.userId.id==user.uid) &&
         <>
              <li  className={item.recipient.id==user.uid?'messageIn':'messageOut'}>
                <div className="App_li_message">
                
                <div onContextMenu={(event)=>isContextActivate(event,item)} className="App_li_message_container">
                <div>{item.date} </div>
                 <div> {item.text}</div>   
                </div>
              
                
                
                </div>
                </li>
            </>
          ))}
          {/* 
        <li className='messageIn'> {location.state.userEmail}: Hello</li>
        <li className='messageOut'>{user.email} : Hi!!</li> */}
        </ul>
        <form className="App_form_message">
          <input
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
            value={textValue}
            placeholder="Enter text"
          />{" "}
          <button style={{display:'none'}} onClick={sendMessage}>Send</button>
        </form>
      </div>
    </>
  );
}
