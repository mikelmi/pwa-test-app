/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

// Потрібний мінімальний fetch щоб Chrome дозволив інсталяцію
self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  console.log("[SW] PUSH:", event.data?.text());

  const payload = event.data?.json?.() || { message: event.data?.text() };

  // Показуємо нативне пуш-сповіщення
  self.registration.showNotification(payload.title || "New message", {
    body: payload.body || payload.message,
  });

  // Доставка в React
  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        client.postMessage({
          type: "PUSH_MESSAGE",
          payload,
        });
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});
