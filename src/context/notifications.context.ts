import { createContext } from "react";

export type NotificationsContextType = {
  isSupported: boolean;
  isConnected: boolean;
  isLoading: boolean;
  subscription: PushSubscription | null;
  error: string | null | undefined;
  connect: (uuid: string) => Promise<void>;
  disconnect: () => Promise<void>;
  uuid: string | undefined | null;
};

export const NotificationsContext = createContext<NotificationsContextType>(
  null as unknown as NotificationsContextType
);
