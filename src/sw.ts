/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const BASE_URL = "/pwa-test-app"; // "/"

import { precacheAndRoute } from "workbox-precaching";
import { isSOSMessage } from "./services/helpers";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  console.log("[SW] PUSH:", event.data?.text());

  const payload = event.data?.json?.() || { body: event.data?.text() };

  const message = payload?.body || payload;

  if (!isSOSMessage(message)) {
    console.log("!SOS message", message);
    return;
  }

  self.registration.showNotification("SOS", {
    body: `Місцезнаходження: ${message.location.latitude},${message.location.longitude}`,
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
  const message = payload?.body || payload;

  let targetUrl = `${BASE_URL}`;

  if (isSOSMessage(message)) {
    const { latitude, longitude } = message.location;
    targetUrl += `?latitude=${latitude}&longitude=${longitude}&uuid=${message.uuid}`;
  }

  console.log("NOTIFICATION CLICK", { targetUrl, payload });

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
          self.clients.openWindow(targetUrl);
        }
      })
  );
});
