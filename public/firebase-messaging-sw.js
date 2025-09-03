importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
   apiKey: "AIzaSyD6aYh09iuH0b5BUdazLqIXRdaXXXonPN8",
  authDomain: "khatfa-9bbef.firebaseapp.com",
  projectId: "khatfa-9bbef",
  storageBucket: "khatfa-9bbef.firebasestorage.app",
  messagingSenderId: "972115306485",
  appId: "1:972115306485:web:737cf3a6bcb43d37dd22bc",
  measurementId: "G-PNF36LNZRW"
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
