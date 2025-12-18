export const Config = {
  apiUrl: import.meta.env.VITE_API_URL,
  vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  baseUrl: import.meta.env.VITE_BASE_URL ?? "/",
};
