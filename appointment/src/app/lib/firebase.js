// src/app/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBxpDMXnNMfByf-rsHnDp4wA2Ecpd__siU",
  authDomain: "therapy-9f1d3.firebaseapp.com",
  projectId: "therapy-9f1d3",
  storageBucket: "therapy-9f1d3.appspot.com", // FIXED this
  messagingSenderId: "707349192967",
  appId: "1:707349192967:web:3b4032f50e111936ba65a2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
