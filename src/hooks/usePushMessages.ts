import { isSOSMessage } from "@/services/helpers";
import type { SOSMessage } from "@/types";
import { useEffect, useState } from "react";

export function usePushMessages() {
  const [messages, setMessages] = useState<SOSMessage[]>([]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      const payload = event.data?.payload?.body || event.data?.payload;

      console.log("message handler", { payload, event });

      if (!isSOSMessage(payload)) {
        return;
      }

      const enriched: SOSMessage = {
        ...payload,
        date: new Date(payload.timestamp),
      };

      if (event.data?.type === "PUSH_MESSAGE") {
        setMessages((prev) => [...prev, enriched]);
      }

      if (event.data?.type === "NOTIFICATION_CLICK") {
        setMessages((prev) => [...prev, { ...enriched, clicked: true }]);
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  return messages;
}
