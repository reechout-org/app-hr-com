importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCHe7WXKlNDVweMbpjpq6IZtCGnyrjCji4",
  authDomain: "hr-app-475516.firebaseapp.com",
  projectId: "hr-app-475516",
  storageBucket: "hr-app-475516.firebasestorage.app",
  messagingSenderId: "965791636605",
  appId: "1:965791636605:web:c14292abf5c1e2d1ea2514",
  measurementId: "G-VEJXXSRLJ5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: payload.data?.questionnaire_id || "notification",
    data: payload.data,
    requireInteraction: false,
    silent: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  const messageData = {
    type: "BACKGROUND_NOTIFICATION",
    payload: payload,
    timestamp: Date.now(),
  };

  // Approach 1: BroadcastChannel (modern browsers)
  try {
    const broadcast = new BroadcastChannel("fcm-notifications");
    broadcast.postMessage(messageData);
    broadcast.close();
  } catch (error) {
    console.error("[SW] BroadcastChannel error:", error);
  }

  // Approach 2: postMessage to all open clients
  self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clients) => {
      if (clients.length === 0) {
        storeNotificationForLater(messageData);
      } else {
        clients.forEach((client) => client.postMessage(messageData));
      }
    })
    .catch(() => storeNotificationForLater(messageData));
});

function storeNotificationForLater(messageData) {
  caches.open("pending-notifications").then((cache) => {
    const response = new Response(JSON.stringify(messageData), {
      headers: { "Content-Type": "application/json" },
    });
    cache.put(`notification-${Date.now()}`, response);
  }).catch((error) => console.error("[SW] Error storing notification:", error));
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data;
  const url = new URL("/questionnaires", self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      })
  );
});
