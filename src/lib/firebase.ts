import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDpYuUrT1zP5JjPdxrjuElt_dEzbCfeCQ",
  authDomain: "fmgolfoazul-ef1cd.firebaseapp.com",
  projectId: "fmgolfoazul-ef1cd",
  storageBucket: "fmgolfoazul-ef1cd.firebasestorage.app",
  messagingSenderId: "75032753737",
  appId: "1:75032753737:web:293540b5d6180673a6f198",
  measurementId: "G-2YRXY5Y1Q0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
