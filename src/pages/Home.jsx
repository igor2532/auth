import { signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, storage } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref as sRef } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Header from "./Header";
import { FcLike,FcDislike  } from "react-icons/fc";

export default function Home() {
  const [array, setArray] = useState([]);
  const [arrayAll, setArrayAll] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userEmailValue, setUserEmailValue] = useState("");

  const [isLoad, setIsLoad] = useState(false);
  const [valueTitle, setValueTitle] = useState("");
  const [valuePrice, setValuePrice] = useState("");
  const [valueImage, setValueImage] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [isFormAdd, setIsFormAdd] = useState(false);
  const [countLikes, setCountLikes] = useState(0)
  const myArrAll = [];
 

  const myUserRef = token ? doc(getFirestore(), "users", user.uid) : "";

  const handleInfo = async () => {
    const q = query(
      collection(getFirestore(), "products"),
      where("userId", "==", myUserRef)
    );
    const all = query(
      collection(getFirestore(), "products"),
      where("userId", "!=", myUserRef)
    );
    const querySnapshot = await getDocs(q);
    const querySnapshotAll = await getDocs(all);
    const myArr = [];

    async function emailByIdSearch(uid) {
      const getDocMy = await getDoc(doc(getFirestore(), "users", uid)).then(
        (data) => {
          return data;
        }
      );
      return getDocMy;
    }
    const myPromise = new Promise((resolve, reject) => {
      querySnapshotAll.forEach((myDoc) => {
        const obj = myDoc.data();
        emailByIdSearch(obj.userId.id).then(async (data,key) => {
     
          
         
            const promiseSnap = new Promise(async(resolve,reject)=>{
              const likesAll = await howLikesInProduct(obj);
              const myLikesValue = await howMyLikesInProduct(obj);
              resolve({likesAll,myLikesValue})
            })
             promiseSnap.then(({likesAll,myLikesValue})=>{
              myArrAll.push({likesMy:myLikesValue.docs.length,likes:likesAll,key:key, userEmail: data.data().email, ...obj });
             })
        });
      });
      querySnapshot.forEach((doc,key) => {
        const obj =doc.data();
        myArr.push({key:key, ...obj});
      });
      resolve(myArrAll);
    });
    myPromise.then((resolve) => {
      setTimeout(() => {
        setArrayAll(myArrAll);
        setArray(myArr);
        setArrayAll(resolve);
        setIsLoad(true);
      },1500);
    });
  };

  useEffect(() => {
    handleInfo().then(() => {});
  }, [isLoad]);


   async function howLikesInProduct(obj)  {
      const querySnapshot = await getDocs(query(
        collection(getFirestore(), "likes"),
        where('productId', '==' ,obj.id)));
       return querySnapshot.docs.length
}


const handleRefreshLikes = async () =>{

  let myLikeArrAll = arrayAll;

  myLikeArrAll.map( async (item,key)=>{
   
      const likesAll = await howLikesInProduct(item);
      const myLikesValue = await howMyLikesInProduct(item);

      item.likesMy = myLikesValue.docs.length;
      item.likes = likesAll;
      key = key;
    return item;

    
});
 
   
    setArrayAll(myLikeArrAll);
    console.log(arrayAll)
    handleInfo();
}


function howMyLikesInProduct(obj)  {
  const q = query(
    collection(getFirestore(), "likes"),
    where('userId', '==',myUserRef.id),where('productId', '==' ,obj.id, ),
  );
   const querySnapshot =  getDocs(q);
return querySnapshot;
  }


const handleLike =  async (item) => {
if (item.likesMy==0) {
  const myUi =  "" + v4();
  const docRefA = doc(collection(getFirestore(), "likes"), myUi);
  const newDocRefA = await setDoc(docRefA, {
    id: myUi,
    userId: myUserRef.id,
    productId: item.id,
    date: new Date().toLocaleString(),
  }).then(()=>{
    handleRefreshLikes();
  });
}
else {
const q = query(
collection(getFirestore(), "likes"),
  where('userId', '==',myUserRef.id),where('productId', '==' ,item.id, ),
);
 const querySnapshot = await getDocs(q);
await deleteDoc(doc(getFirestore(),'likes',querySnapshot.docs[0].data().id));
handleRefreshLikes();
}

  };
  const addProduct = async (event) => {
    event.preventDefault();
    if (imageUpload !== null) {
      setIsLoad(false);
      const imageName = `${imageUpload.name + v4()}`;
      const imageRef = sRef(storage, `images/${imageName}`);
      const uploadBytesS = await uploadBytes(imageRef, imageUpload).then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const myUi = arrayAll.length + "" + v4();
            const docRefA = doc(collection(getFirestore(), "products"), myUi);
            const newDocRefA = await setDoc(docRefA, {
              id: myUi,
              title: valueTitle,
              price: valuePrice,
              image: url,
              userId: myUserRef,
              date: new Date().toLocaleString(),
            }).then(()=>{
              handleInfo();
            });
          });
        }
      );
    }
  };
  function howDate(item) {
    const selectedText = item.date;
    const splArr = selectedText.split(",");
    return splArr[0];
  }

  return (
    <>
      {token && (
        <>
          <Header />
          {isFormAdd && (
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
                  <input
                    className="App_inp_file"
                    type="file"
                    onChange={(e) => {
                      setImageUpload(e.target.files[0]);
                    }}
                  />
                  <button onClick={addProduct}>Add product</button>
                </form>
              </div>
            </>
          )}
          <div className="App_form_button_add">
            <button
              onClick={() => {
                setIsFormAdd(!isFormAdd);
              }}
            >
              {isFormAdd ? "Close form" : "Add recipe"}
            </button>
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
          <button onClick={handleRefreshLikes}>refresh</button>
          <h2 className="h2_app">Блюда других поваров</h2>

          {isLoad && (
            <div className="App_items_all">
              {arrayAll.map((item, key) => (
                <>
                  <div key={key}>
                   <NavLink to='product'
                    state={{
                      object: item.title,
                    }}
                   >
                   <img src={item.image} />
                   </NavLink>
                    
                    <span>{item.title}</span>
                    <button className="App_like_button"  onClick={()=>handleLike(item)}>
                      {(item.likesMy==0) && <> <FcLike /></>}
                      {(item.likesMy>0) && <> <FcDislike /></>}
                     {item.likes} </button>
                    <NavLink
                      state={{
                        userId: item.userId.id,
                        userEmail: item.userEmail,
                      }}
                      className="App_href_author"
                      to="user"
                    >
                      <span>{item.userEmail}</span>
                    </NavLink>
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
