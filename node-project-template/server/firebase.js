// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtqfKCmNcVDzP-cS2bw7fBrU8vHQS0jrg",
  authDomain: "farmconnectproject-76614.firebaseapp.com",
  projectId: "farmconnectproject-76614",
  storageBucket: "farmconnectproject-76614.appspot.com",
  messagingSenderId: "222259070328",
  appId: "1:222259070328:web:cd7464179b5e65b3bff48d",
  measurementId: "G-SDTDLPGK98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);