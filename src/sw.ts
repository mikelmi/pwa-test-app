/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const BASE_URL = "/pwa-test-app"; // "/"

import { precacheAndRoute } from "workbox-precaching";
import { isSOSMessage } from "./services/helpers";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  console.log("[SW] PUSH:", event.data?.text());

  const payload = event.data?.json?.() || { message: event.data?.text() };

  self.registration.showNotification(payload.title || "New message", {
    body: payload.body || payload.message,
    data: payload,
  });

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

  const payload = event.notification.data;
  let targetUrl = `${BASE_URL}/map`;

  if (isSOSMessage(payload)) {
    const { latitude, longitude } = payload.location;
    targetUrl += `?latitude=${latitude}&longitude=${longitude}`;
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          client.postMessage({
            type: "NOTIFICATION_CLICK",
            payload,
          });
          if ("focus" in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        if (self.clients.openWindow) {
          self.clients.openWindow(targetUrl).then((win) => {
            win?.postMessage({ type: "NOTIFICATION_CLICK", payload });
          });
        }
      })
  );
});
