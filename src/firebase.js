import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyD6aYh09iuH0b5BUdazLqIXRdaXXXonPN8",
  authDomain: "khatfa-9bbef.firebaseapp.com",
  projectId: "khatfa-9bbef",
  storageBucket: "khatfa-9bbef.firebasestorage.app",
  messagingSenderId: "972115306485",
  appId: "1:972115306485:web:737cf3a6bcb43d37dd22bc",
  measurementId: "G-PNF36LNZRW"
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(firebaseApp);

// Correctly export a promise that resolves to messaging instance (or null)
export const getMessagingObject = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error("Messaging not supported:", err);
    return null;
  }
};

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    const messaging = await getMessagingObject();
    if (!messaging) return;

    const currentToken = await getToken(messaging, {
        vapidKey: "BDlx3HWqStjDt9_OJfyiCoMES9i-9GVWA1sCjzh_ouP8opj2XaSZl40GB69TArLt3sZFg3bNj311QijgKKJdwOQ",
    });

    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
    } else {
      setTokenFound(false);
      setFcmToken();
    }
  } catch (err) {
    console.error("Token fetch error:", err);
  }
};

// onMessageListener function
export const onMessageListener = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = await getMessagingObject();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
