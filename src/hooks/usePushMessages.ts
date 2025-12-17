import { isSOSMessage } from "@/services/helpers";
import type { SOSMessage } from "@/types";
import { useEffect, useState } from "react";

export function usePushMessages() {
  const [messages, setMessages] = useState<SOSMessage[]>([]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      if (!isSOSMessage(event.data.payload)) {
        return;
      }

      const payload: SOSMessage = event.data.payload;

      payload.date = new Date(payload.timestamp);

      if (event.data?.type === "PUSH_MESSAGE") {
        setMessages((prev) => [...prev, payload]);
      }

      if (event.data?.type === "NOTIFICATION_CLICK") {
        setMessages((prev) => [...prev, { clicked: true, ...payload }]);
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  return messages;
}
