
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWlsRk9u9LCIBguXg9oQvM46iid5HtryU",
  authDomain: "mgp-cloud.firebaseapp.com",
  projectId: "mgp-cloud",
  storageBucket: "mgp-cloud.appspot.com",
  messagingSenderId: "848434034388",
  appId: "1:848434034388:web:ac1309f172c3d0a0caad41",
  measurementId: "G-YZBM1H0FEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
