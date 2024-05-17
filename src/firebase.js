import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCTqAk17zIndor69QppclgP5rpJgsukao0",
    authDomain: "react-firebase-auth-email-pwd1.firebaseapp.com",
    projectId: "react-firebase-auth-email-pwd1",
    storageBucket: "react-firebase-auth-email-pwd1.appspot.com",
    messagingSenderId: "372606957741",
    appId: "1:372606957741:web:647ad85d06b6a3dae06e24",
    measurementId: "G-2RG4Q7QC07"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  export const auth = getAuth();
  export default app;