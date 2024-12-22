// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHI8sWXCb7NIHGeuvVTdY_NkEBOk9s-ns",
  authDomain: "projetogamificaeduk.firebaseapp.com",
  projectId: "projetogamificaeduk",
  storageBucket: "projetogamificaeduk.appspot.com",
  messagingSenderId: "402375253085",
  appId: "1:402375253085:web:c882c3e23942e5874801b4",
  measurementId: "G-2TY4YPL585"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db; 
