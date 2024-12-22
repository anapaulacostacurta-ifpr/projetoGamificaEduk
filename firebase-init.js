import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDHI8sWXCb7NIHGeuvVTdY_NkEBOk9s-ns",
    authDomain: "projetogamificaeduk.firebaseapp.com",
    projectId: "projetogamificaeduk",
    storageBucket: "projetogamificaeduk.appspot.com",
    messagingSenderId: "402375253085",
    appId: "1:402375253085:web:c882c3e23942e5874801b4",
    measurementId: "G-2TY4YPL585"
  };
  
  firebase.initializeApp(firebaseConfig);  
  
// Exportar os serviços
const db = firebase.firestore();

export { firebase, db};
  