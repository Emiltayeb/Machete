import { getApp as _getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getAuth as _getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_ID,
  appId: process.env.NEXT_PUBLIC_SENDER_ID,
};

const firebaseIsRunning = () => !!(getApps().length);

export function getApp() {
  if (!firebaseIsRunning()) {
    console.log("initzliing..")
    initializeApp(firebaseConfig);
  }
  return _getApp();
}

export const app = getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)