<!-- firebase-config.js (usar como módulo) -->
<script type="module">
// SDKs de Firebase (modular CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5OQhX5_Uu3lunMBxcOqQL4yHhe-vdXzA",
  authDomain: "masterfibraec.firebaseapp.com",
  projectId: "masterfibraec",
  storageBucket: "masterfibraec.firebasestorage.app",
  messagingSenderId: "568089252571",
  appId: "1:568089252571:web:db36ba765eaa45029c32fe"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup, onAuthStateChanged, signOut };
</script>
