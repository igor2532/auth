import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database, storage } from "../firebase";
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
import { ref } from "firebase/database";
import { getDownloadURL, ref as sRef } from "firebase/storage";
import { uploadBytes, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [array, setArray] = useState([]);
  const [arrayAll, setArrayAll] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [valueTitle, setValueTitle] = useState("");
  const [valuePrice, setValuePrice] = useState("");
  const [valueImage, setValueImage] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  const categoryDocRef = doc(getFirestore(), "users", user.uid);
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
    const myArrAll = [];
    querySnapshot.forEach((doc) => {
      myArr.push(doc.data());
    });
    querySnapshotAll.forEach((doc) => {
      myArrAll.push(doc.data());
    });
    setArray(myArr);
    setArrayAll(myArrAll);
    setIsLoad(true)
  };

  useEffect(() => {
    handleInfo();
  }, []);

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
            }).then(() => {
              handleInfo();
            });
          });
        }
      );
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); 
    
  };
  return (
    <>
      {token && (
        <>
          <header className="App_header">
            <div className="App_logo">
              <img src="https://cdn-icons-png.flaticon.com/512/6078/6078201.png" />{" "}
            </div>
            <div className="App_functions">
              <button>Ваш email:{user.email} </button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </header>
          <div className="App_form_for_add">
            <form>
              <input
                onChange={(e) => setValueTitle(e.target.value)}
                placeholder="Enter title"
              />
              <input
                onChange={(e) => setValuePrice(e.target.value)}
                type="number"
                placeholder="Enter price"
              />
              <input
                type="file"
                onChange={(e) => {
                  setImageUpload(e.target.files[0]);
                }}
              />
              <button onClick={addProduct}>Add product</button>
            </form>
          </div>
          <h2 className="h2_app">Мои блюда</h2>

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
              <span class="loader"></span>
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
                  </div>
                </>
              ))}
            </div>
          )}

          {!isLoad && (
            <div className="App_loading">
              <span class="loader"></span>
            </div>
          )}
        </>
      )}
    </>
  );
}
