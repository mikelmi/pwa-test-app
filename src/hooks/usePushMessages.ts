import apiClient from "@/services/apiClient";
import { isSOSMessage } from "@/services/helpers";
import type { SOSMessage } from "@/types";
import { useEffect, useState } from "react";

export function usePushMessages() {
  const [messages, setMessages] = useState<SOSMessage[]>([]);

  useEffect(() => {
    const loadLastMessages = async () => {
      try {
        const lastMessages = await apiClient.getLastMessages();

        if (lastMessages?.length) {
          setMessages(prepareMessagesFromApi(lastMessages));
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

      const newMessage = mapMessage(payload);

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

function prepareMessages(mesages: SOSMessage[]): SOSMessage[] {
  return mesages.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
}

function prepareMessagesFromApi(mesages: SOSMessage[]): SOSMessage[] {
  return prepareMessages(
    mesages.filter((msg) => isSOSMessage(msg)).map(mapMessage)
  );
}

function mapMessage(msg: SOSMessage): SOSMessage {
  if (msg.date) {
    return msg;
  }

  return { ...msg, date: new Date(msg.timestamp) };
}
