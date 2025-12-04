import { Config } from "../config";

function subscribe(sub: PushSubscription) {
  return fetch(`${Config.apiUrl}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
}

function unsubscribe(sub: PushSubscription) {
  return fetch(`${Config.apiUrl}/unsubscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
}

function notifyAll(message?: string) {
  return fetch(`${Config.apiUrl}/notify-all`, {
    method: "POST",
    body: message ? JSON.stringify({ message }) : undefined,
  });
}

const apiClient = {
  subscribe,
  unsubscribe,
  notifyAll,
};

export default apiClient;
