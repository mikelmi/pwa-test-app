import { useEffect, useState } from "react";
import { Config } from "../config";
import apiClient from "../services/apiClient";

export const usePushNotifications = (autoSubscribeEnable = true) => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);
  }, []);

  // Autosubscribe on mount
  useEffect(() => {
    if (!isSupported || !autoSubscribeEnable) {
      return;
    }

    subscribe();
  }, [isSupported, autoSubscribeEnable]);

  const subscribe = async () => {
    try {
      setStatus("checking");

      const reg = await navigator.serviceWorker.ready;

      let existing = await reg.pushManager.getSubscription();

      if (existing) {
        const existingKey = arrayBufferToBase64(
          existing.options.applicationServerKey as ArrayBuffer
        );

        if (existingKey !== Config.vapidKey) {
          await existing.unsubscribe();
          existing = null;
        }
      }

      if (!existing) {
        setStatus("subscribing");

        existing = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: Config.vapidKey,
        });
      }

      setStatus("saving");
      await apiClient.subscribe(existing);

      setSubscription(existing);
      setSubscribed(true);
      setStatus("ready");
    } catch (error) {
      const err = error as Error;

      console.error("Push subscribe error:", err);
      setError(err.message);
      setStatus("error");
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...bytes));
  };

  return {
    isSupported,
    subscribed,
    subscription,
    subscribe,
    error,
    status,
    notifyAlll: apiClient.notifyAll,
  };
};
