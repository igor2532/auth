import { signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, resolvePath, useNavigate } from "react-router-dom";
import { auth, database, storage } from "../firebase";
import {
  addDoc,
  collection,
  collectionGroup,
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
import { FcLike, FcDislike } from "react-icons/fc";
// import  firebase from "firebase/compat/app";

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
  const [countLikes, setCountLikes] = useState(0);
  const myArrAll = [];
  const [isLoadingLike, setIsLoadingLike] = useState(true);

  const myUserRef = token ? doc(getFirestore(), "users", user.uid) : "";

  const handleInfo = async () => {
    const myProducts = query(collectionGroup(getFirestore(), "Products"));
    const allProducts = query(collectionGroup(getFirestore(), "Products"));
    const querySnapshotAll = await getDocs(allProducts);
    const myArr = [];
    const myDocEach = new Promise((resolve, reject) => {
      querySnapshotAll.forEach(async (myDoc) => {
        const obj = await myDoc.data();

        const likes = await query(
          collection(
            getFirestore(),
            `/users/${obj.userId}/Products/${obj.id}/likes`
          )
        );
        const likesMy = await query(
          collection(
            getFirestore(),
            `/users/${obj.userId}/Products/${obj.id}/likes`
          ),
          where("userId", "==", myUserRef.id)
        );
        const emailUserDoc = await getDoc(doc(getFirestore(), "users", obj.userId))
       
        const likesInt = await getDocs(likes)
          .then((data) => {
            return data.docs.length;
          })
          .then(async (data1) => {
            const likesMyInt = await getDocs(likesMy).then((data) => {
              myArrAll.push({
                ...obj,
                likes: data1,
                likesMy: data.docs.length,
                userEmail: emailUserDoc.data().email,
              });
            });
          });
        const lites = async () => {
          setIsLoad(true);
          setArrayAll(myArrAll);
        };
        lites();
      });
    });
  };

  const handleLike = async (obj) => {
    if (obj.likesMy == 0) {
      setIsLoadingLike(false)
      const newArray = arrayAll;
      await newArray.map((item, key) => {
        if (item.id == obj.id) {
          item.likes = item.likes + 1;
          item.likesMy = item.likesMy + 1;
          item.key = key;
        } else {
          item = item;
        }
      });
      setArrayAll(newArray);
      
      const myUi = "like" + v4();
      const docRefA = doc(
        collection(
          getFirestore(),
          `users/${obj.userId}/Products/${obj.id}/likes`
        ),
        myUi
      );
      const newDocRefA = await setDoc(docRefA, {
        id: myUi,
        userId: myUserRef.id,
        productId: obj.id,
        date: new Date().toLocaleString(),
      }).then(()=>{
       setTimeout(()=>{setIsLoadingLike(true)},1)
      });
    } else if (obj.likesMy > 0) {
      const newArray = arrayAll;
      setIsLoadingLike(false)
       newArray.map((item, key) => {
        if (item.id == obj.id) {
          item.likes = item.likes - 1;
          item.likesMy = item.likesMy - 1;
          item.key = key;
        } else {
          item = item;
        }
      });
      setArrayAll(newArray);
     
      const q = query(
        collection(
          getFirestore(),
          `users/${obj.userId}/Products/${obj.id}/likes`
        ),
        where("userId", "==", myUserRef.id)
      );
      const querySnapshot = await getDocs(q);
      await deleteDoc(
        doc(
          getFirestore(),
          `users/${obj.userId}/Products/${obj.id}/likes`,
          querySnapshot.docs[0].data().id
        )
      ).then(()=>{
        setTimeout(()=>{setIsLoadingLike(true)},1)
      });
      // handleInfo();
    }
  };

  useMemo(() => {
    handleInfo();
  }, [isLoad]);
  // useEffect(() => {
  //   handleInfo()
  // }, [isLoad]);

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
            const docRefA = doc(
              collection(getFirestore(), `users/${myUserRef.id}/Products`),
              myUi
            );

            const newDocRefA = await setDoc(docRefA, {
              id: myUi,
              title: valueTitle,
              price: valuePrice,
              image: url,
              userId: myUserRef.id,
              date: new Date().toLocaleString(),
            }).then(() => {
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
          {/* <button onClick={handleRefreshLikes}>refresh</button> */}
          <h2 className="h2_app">Блюда других поваров</h2>

          {isLoad && (
            <div className="App_items_all">
              {arrayAll.map((item, key) => (
                <>
                  <div key={key}>
                    <NavLink
                      to="product"
                      state={{
                        object: item,
                      }}
                    >
                      <img src={item.image} />
                    </NavLink>

                    <span>{item.title}</span>
                    {isLoadingLike && (
                      <button
                        className="App_like_button"
                        onClick={() => handleLike(item)}
                      >
                        {item.likesMy == 0 && (
                          <>
                            {" "}
                            <FcLike />
                          </>
                        )}
                        {item.likesMy > 0 && (
                          <>
                            {" "}
                            <FcDislike />
                          </>
                        )}
                        {item.likes}{" "}
                      </button>
                    )}
                    {!isLoadingLike && (
                      <div className="App_loading">
                        <span className="loader"></span>
                      </div>
                    )}
                    <NavLink
                      state={{
                        userId: item.userId,
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
