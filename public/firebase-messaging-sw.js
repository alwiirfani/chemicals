importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDs1aPZ8hYEAje2lgNyCTFvF7eOrNdlSuI",
  authDomain: "chemicals-11.firebaseapp.com",
  projectId: "chemicals-11",
  storageBucket: "chemicals-11.firebasestorage.app",
  messagingSenderId: "544085951535",
  appId: "1:544085951535:web:c8d5e453d5593946dab2da",
  measurementId: "G-6MKPV9Y3YM",
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const { title, body, icon, badge } = payload.notification;
  console.log("Icon:", icon, "Badge:", badge);
  self.registration.showNotification(title, {
    body,
    icon: icon || "/notification192.png",
    badge: badge || "/notification48.png",
    data: { url: payload.data?.url || "/" }, // Deep link
  });
});

// Handle klik notifikasi
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});
