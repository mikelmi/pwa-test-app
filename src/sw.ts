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

  console.log("SW] PUSH PAYLOAD:", payload);

  const message = payload?.body || payload;

  if (!isSOSMessage(message)) {
    console.log("!SOS message", message);
    return;
  }

  console.log(
    `Show notification ${message.location.latitude},${message.location.longitude}`
  );

  event.waitUntil(
    (async () => {
      try {
        await self.registration.showNotification("SOS", {
          body: `Місцезнаходження: ${message.location.latitude},${message.location.longitude}`,
          data: payload,
        });
        console.log("[SW] Notification shown");
      } catch (e) {
        console.error("[SW] showNotification error:", e);
      }

      const clients = await self.clients.matchAll({
        includeUncontrolled: true,
      });

      for (const client of clients) {
        client.postMessage({ type: "PUSH_MESSAGE", payload });
      }
    })()
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
