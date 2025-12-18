import { useEffect, useState } from "react";
import { Config } from "../config";
import apiClient from "../services/apiClient";

export const usePushNotifications = (autoSubscribeEnable = false) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const subscribe = async (uuid?: string | null) => {
    try {
      setIsLoading(true);
      setError(null);

      const reg = await navigator.serviceWorker.getRegistration(Config.baseUrl);

      if (!reg) {
        throw new Error("Service worker не зареєстрований!");
      }

      let existing = reg?.pushManager
        ? await reg.pushManager.getSubscription()
        : undefined;

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
        existing = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: Config.vapidKey,
        });
      }

      await apiClient.subscribe(existing, uuid);

      setSubscription(existing);
      setIsSubscribed(true);
    } catch (error) {
      const err = error as Error;

      console.error("Push subscribe error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (uuid?: string | null) => {
    try {
      setIsLoading(true);
      setError(null);

      const reg = await navigator.serviceWorker.ready;

      const existing = reg?.pushManager
        ? await reg.pushManager.getSubscription()
        : undefined;

      if (existing) {
        await existing.unsubscribe();
        await apiClient.unsubscribe(existing, uuid);
      }

      setSubscription(null);
      setIsSubscribed(false);
    } catch (error) {
      const err = error as Error;

      console.error("Push unsubscribe error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...bytes));
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
    error,
    isLoading,
  };
};
