import { useEffect, useState } from "react";

export function usePushMessages() {
  const [messages, setMessages] = useState<unknown[]>([]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "PUSH_MESSAGE") {
        setMessages((prev) => [...prev, event.data.payload]);
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  return messages;
}
