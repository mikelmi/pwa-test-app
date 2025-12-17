import type { SOSMessage } from "@/types";
import { Config } from "../config";

function subscribe(sub: PushSubscription, uuid?: string | null) {
  console.debug("api:subscribe", uuid);

  return fetch(`${Config.apiUrl}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
}

function unsubscribe(sub: PushSubscription, uuid?: string | null) {
  console.debug("api:unsubscribe", uuid);

  return fetch(`${Config.apiUrl}/unsubscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
}

function notifyAll(message?: string | object) {
  return fetch(`${Config.apiUrl}/notify-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: message ? JSON.stringify({ message }) : undefined,
  });
}

async function notifyAllMyLocation(uuid: string) {
  const location = await getMyLocation();

  const message: SOSMessage = {
    uuid,
    location: location.coords,
    timestamp: new Date().getTime(),
  };

  return await notifyAll(message);
}

async function getMyLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Сервіс геолокації недоступний"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      }
    );
  });
}

const apiClient = {
  subscribe,
  unsubscribe,
  notifyAll,
  notifyAllMyLocation,
};

export default apiClient;
