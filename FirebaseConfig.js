
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";


import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5QLkfUICMtAMb_SjmHN7PXwSM7xCtn9A",
  authDomain: "chat-app-firebase-3e293.firebaseapp.com",
  projectId: "chat-app-firebase-3e293",
  storageBucket: "chat-app-firebase-3e293.firebasestorage.app",
  messagingSenderId: "92197519063",
  appId: "1:92197519063:web:dafc03d2fa0c981474fa92",
};

// prevent re-initializing in fast refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


//  (React Native persistence)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// firestore
export const db = getFirestore(app);
