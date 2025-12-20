import { useMapModalContext } from "@/context";
import { isSOSMessage } from "@/services/helpers";
import type { SOSMessage } from "@/types";
import { useEffect } from "react";

export function useNotificationClickListener() {
  const { openModal } = useMapModalContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uuid = params.get("uuid");
    const lat = params.get("latitude") || params.get("lat");
    const lng = params.get("longitude") || params.get("lng");

    if (lat && lng) {
      const location: SOSMessage["location"] = {
        latitude: Number(lat),
        longitude: Number(lng),
      };
      openModal({ uuid, location: location });
    }
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      const payload =
        event.data?.payload?.body || event.data?.payload || event.data;

      if (!isSOSMessage(payload)) {
        return;
      }

      if (event.data?.type === "NOTIFICATION_CLICK") {
        openModal(payload);
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);
}
