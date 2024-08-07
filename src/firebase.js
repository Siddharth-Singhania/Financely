
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth } from "firebase/auth";
import { getFirestore, doc,setDoc} from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDskWtCIuvpthOBO-YbvIW2iNEor7qKzoE",
  authDomain: "financely-30512.firebaseapp.com",
  projectId: "financely-30512",
  storageBucket: "financely-30512.appspot.com",
  messagingSenderId: "840020878532",
  appId: "1:840020878532:web:16fcf820664aac6dc0d591",
  measurementId: "G-BCBX54602J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function logout(signup){
  try {
      signOut(auth).then(()=>{
          if(signup === true){
              toast.success("logged out!");
          }
          navigate("/");
      })
  } catch (error) {
      if(signup===true){
          toast.error(error.message)
      }
  }
}

export {db,auth,doc,setDoc,provider,logout};