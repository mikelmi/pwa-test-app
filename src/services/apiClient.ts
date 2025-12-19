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

async function getLastMessages() {
  console.debug("api:getLastMessages");

  const response = await fetch(`${Config.apiUrl}/messages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
}

const apiClient = {
  subscribe,
  unsubscribe,
  notifyAll,
  getLastMessages,
};

export default apiClient;
