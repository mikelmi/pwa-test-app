import apiClient from "@/services/apiClient";
import { isSOSMessage } from "@/services/helpers";
import type { SOSMessage } from "@/types";
import { useEffect, useState } from "react";

function prepareMessages(mesages: SOSMessage[]): SOSMessage[] {
  return mesages.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
}

export function usePushMessages() {
  const [messages, setMessages] = useState<SOSMessage[]>([]);

  useEffect(() => {
    const loadLastMessages = async () => {
      try {
        const lastMessages = await apiClient.getLastMessages();

        if (lastMessages?.length) {
          setMessages(prepareMessages(lastMessages));
        }
      } catch {
        console.debug("Cannot load las messages");
      }
    };

    loadLastMessages();
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      const payload = event.data?.payload?.body || event.data?.payload;

      console.debug("message handler", { payload, event });

      if (!isSOSMessage(payload)) {
        return;
      }

      const newMessage: SOSMessage = {
        ...payload,
        date: new Date(payload.timestamp),
      };

      if (event.data?.type === "PUSH_MESSAGE") {
        setMessages((prev) => prepareMessages([...prev, newMessage]));
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  return messages;
}
