//import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/database'
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAFT22vxY8L1pXUtBZpm6VUxdjS6IFleRs",
  authDomain: "fileuploading-67153.firebaseapp.com",
  databaseURL: "https://fileuploading-67153-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fileuploading-67153",
  storageBucket: "fileuploading-67153.appspot.com",
  messagingSenderId: "421584813648",
  appId: "1:421584813648:web:455fea7f8670ab43b09b55"
};

const app = firebase.initializeApp(firebaseConfig);
export default app
export const storage = getStorage(app);
export const db = getDatabase(app);