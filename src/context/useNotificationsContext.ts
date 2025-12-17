import { useContext } from "react";
import { NotificationsContext } from "./notifications.context";

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
