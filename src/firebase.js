import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDDwbJat0Y13poehge4KfwTBx1jiX26Nfs",
    authDomain: "eiteck-reserva.firebaseapp.com",
    projectId: "eiteck-reserva",
    storageBucket: "eiteck-reserva.appspot.com",
    messagingSenderId: "1013317886566",
    appId: "1:1013317886566:web:c8fce6b6b30700bf34c3a7"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth()

  export{firebase,auth}