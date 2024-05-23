import { signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth,storage } from "../firebase";
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
import { uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Header from "./Header";
export default function Home() {
  const [array, setArray] = useState([]);
  const [arrayAll, setArrayAll] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userEmailValue, setUserEmailValue] = useState('');

  const [isLoad, setIsLoad] = useState(false);
  const [valueTitle, setValueTitle] = useState("");
  const [valuePrice, setValuePrice] = useState("");
  const [valueImage, setValueImage] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [isFormAdd, setIsFormAdd] = useState(false);
  const myArrAll = [];
  
  if (token) {

    
  }
  const categoryDocRef = token?doc(getFirestore(), "users", user.uid):'';
 
  const handleInfo = async () => {
    const q = query(
      collection(getFirestore(), "products"),
      where("userId", "==", categoryDocRef)
    );
    const all = query(
      collection(getFirestore(), "products"),
      where("userId", "!=", categoryDocRef)
    );
    const querySnapshot = await getDocs(q);
    const querySnapshotAll = await getDocs(all);
    const myArr = [];
   
   async function emailByIdSearch(uid) {
   const getDocMy = await getDoc(doc(getFirestore(), 'users', uid))
  .then((data)=>{
     return data
     })
     return getDocMy;
   } 
    const myPromise = new Promise((resolve,reject)=>{
      querySnapshotAll.forEach((myDoc) => {
        const obj =   myDoc.data();
      emailByIdSearch(obj.userId.id).then((data)=>{
        myArrAll.push({userEmail: data.data().email,...obj});
      })
      });
      querySnapshot.forEach((doc) => {
        myArr.push(doc.data());
      });
      resolve(myArrAll)
    })
    myPromise.then((resolve)=>{
      setTimeout(()=>{
        setArrayAll(myArrAll)
        setArray(myArr);
        setArrayAll(resolve);
        setIsLoad(true)
       },1000)  
    })
  };

useEffect(()=>{
    handleInfo().then(()=>{
    })
},[isLoad])

   


  const addProduct = async (event) => {
    event.preventDefault();
    if (imageUpload !== null) {
      setIsLoad(false);
      const imageName = `${imageUpload.name + v4()}`;
      const imageRef = sRef(storage, `images/${imageName}`);
      const uploadBytesS = await uploadBytes(imageRef, imageUpload).then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(`image ${url}`);
            addDoc(collection(getFirestore(), "products"), {
              title: valueTitle,
              price: valuePrice,
              image: url,
              userId: categoryDocRef,
              date:new Date().toLocaleString()
            }).then(() => {
              handleInfo();
            });
          });
        }
      );
    }
  };
function howDate(item) {
  const selectedText = item.date
  console.log(item)
const splArr = selectedText.split(',');
return splArr[0];

 }

  return (
    <>
      {token && (
        <>
          <Header  />
          {
            isFormAdd &&
             <> 
                 <div className="App_form_for_add">
            <form>
              <input
                onChange={(e) => setValueTitle(e.target.value)}
                placeholder="Enter title "
              />
              <input
                onChange={(e) => setValuePrice(e.target.value)}
                type="number"
                placeholder="Enter price"
              />
              <input className="App_inp_file"
                type="file"
                onChange={(e) => {
                  setImageUpload(e.target.files[0]);
                }}
              />
              <button onClick={addProduct}>Add product</button>
            </form>
          </div>
              </>
                  }
          <div className="App_form_button_add">
            <button onClick={()=>{setIsFormAdd(!isFormAdd)}}>{isFormAdd?'Close form':'Add recipe'}</button>
          </div>

      
          <h2 className="h2_app">Мои блюда </h2>

          {isLoad && (
            <div className="App_items">
              {array.map((item, key) => (
                <>
                  <div key={key}>
                    <img src={item.image} />
                    <span>{item.title}</span>
                    <span>{item.price}</span>
                  </div>
                </>
              ))}
            </div>
          )}

          {!isLoad && (
            <div className="App_loading">
              <span className="loader"></span>
            </div>
          )}
          <h2 className="h2_app">Блюда других поваров</h2>

          {isLoad && (
            <div className="App_items_all">
              {arrayAll.map((item, key) => (
                <>
                  <div key={key}>
                    <img src={item.image} />
                    <span>{item.title}</span>
                    <NavLink state={{ userId: item.userId.id, userEmail: item.userEmail }} className='App_href_author' to='user'><span>{item.userEmail}</span></NavLink>
                    <span>cost: ${item.price}</span>
                    <span>date: {howDate(item)}</span>
                  </div>
                </>
              ))}
            </div>
          )}

          {!isLoad && (
            <div className="App_loading">
              <span className="loader"></span>
            </div>
          )}
        </>
      )}
    </>
  );
}
