import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth ,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import {getDatabase} from 'firebase/database';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    // apiKey: "AIzaSyCTqAk17zIndor69QppclgP5rpJgsukao0",
    // authDomain: "react-firebase-auth-email-pwd1.firebaseapp.com",
    // projectId: "react-firebase-auth-email-pwd1",
    // storageBucket: "react-firebase-auth-email-pwd1.appspot.com",
    // messagingSenderId: "372606957741",
    // appId: "1:372606957741:web:647ad85d06b6a3dae06e24",
    // measurementId: "G-2RG4Q7QC07",
    // databaseURL: `https://react-firebase-auth-email-pwd1-default-rtdb.firebaseio.com`

    apiKey: "AIzaSyA78jGZOyOVtMLG8lZYNe5LQBNsmvBZ1vg",
    authDomain: "projectpwafirebase.firebaseapp.com",
    projectId: "projectpwafirebase",
    storageBucket: "projectpwafirebase.appspot.com",
    messagingSenderId: "202962708456",
    appId: "1:202962708456:web:c1d575289d85fd0e96e65d",
    databaseURL: `https://projectpwafirebase-default-rtdb.firebaseio.com`

  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const provider = new GoogleAuthProvider();
provider.setCustomParameters({   
    prompt : "select_account "
});

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
  export const auth = getAuth(app);
  export const storage = getStorage(app);
  export const database = getDatabase(app);

export default app;