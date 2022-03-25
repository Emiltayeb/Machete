import { getApp as _getApp, getApps, initializeApp } from "firebase/app";
import { getAuth as _getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore as _getFirestore } from "firebase/firestore";


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
  if (!firebaseIsRunning()) initializeApp(firebaseConfig);

  return _getApp();
}