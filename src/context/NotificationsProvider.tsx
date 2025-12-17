import { usePushNotifications } from "@/hooks";
import { useEffect, useState, type ReactNode } from "react";
import {
  NotificationsContext,
  type NotificationsContextType,
} from "./notifications.context";

type Props = {
  children: ReactNode;
};

export default function NotificationsProvider({ children }: Props) {
  const [uuid, setUuid] = useState<string | null>(
    localStorage.getItem("UUID") ?? null
  );

  const {
    error,
    isLoading,
    isSubscribed: isConnected,
    isSupported,
    subscribe,
    unsubscribe,
    subscription,
  } = usePushNotifications();

  useEffect(() => {
    if (uuid) {
      subscribe(uuid);
      localStorage.setItem("UUID", uuid);
    }
  }, [uuid]);

  const connect = async (newUuid: string) => {
    setUuid(newUuid);
  };

  const disconnect = async () => {
    await unsubscribe(uuid);
    localStorage.removeItem("UUID");
  };

  const value: NotificationsContextType = {
    error,
    isLoading,
    isConnected,
    isSupported,
    connect,
    disconnect,
    subscription,
    uuid,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
