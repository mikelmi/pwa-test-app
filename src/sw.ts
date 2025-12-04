/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const BASE_URL = "/pwa-test-app"; // "/"

import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

// Потрібний мінімальний fetch щоб Chrome дозволив інсталяцію
self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  console.log("[SW] PUSH:", event.data?.text());

  const payload = event.data?.json?.() || { message: event.data?.text() };

  // 1️⃣ Показуємо нативне повідомлення
  self.registration.showNotification(payload.title || "New message", {
    body: payload.body || payload.message,
    data: BASE_URL, //payload.url || BASE_URL, // зберігаємо URL для click
  });

  // 2️⃣ Доставляємо повідомлення у всі відкриті вкладки React
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

  const targetUrl = event.notification.data || BASE_URL;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Фокус на вже відкритому PWA / вкладці
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            client.navigate(targetUrl); // оновлюємо URL, якщо потрібно
            return;
          }
        }
        // Відкриваємо нову вкладку / PWA
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      })
  );
});
