import React, { useEffect, useId, useState } from "react";
import Header from "./Header";
import { NavLink, useLocation } from "react-router-dom";
import { auth, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref as sRef } from "firebase/storage";
export default function Chat() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [messagesArray, setMessagesArray] = useState([]);
  const [textValue, setTextValue] = useState("");
  const userId = token
    ? doc(getFirestore(), "users", location.state.userId)
    : "";
  const recipient = token ? doc(getFirestore(), "users", user.uid) : "";
  const handleInfo = async () => {
    console.log(userId);
    // console.log(recipient)
    const q = query(
      collection(getFirestore(), "messages"),
      where("recipient", "==", userId),
      where("userId", "==", recipient)
    );
    const querySnapshot = await getDocs(q);
    const myMessages = [];
    querySnapshot.forEach((myDoc) => {
      const obj = myDoc.data();
      myMessages.push({ ...obj });
      console.log(obj);
    });
    setMessagesArray(myMessages);
  };
  const sendMessage = async (event) => {
    event.preventDefault();
    addDoc(collection(getFirestore(), "messages"), {
      userId: recipient,
      recipient: userId,
      text: textValue,
    });
    handleInfo();
  };
  useEffect(() => {
    handleInfo();
  }, []);

  return (
    <>
      <Header />
      <div className="App_userPage">Chat with {location.state.userEmail}</div>

      <div className="App_messages">
        <ul>
          {messagesArray.map((item, key) => (
            <>
              <li className="messageIn"> {item.text}</li>
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
            placeholder="Enter text"
          />{" "}
          <button onClick={sendMessage}>Send</button>
        </form>
      </div>
    </>
  );
}
