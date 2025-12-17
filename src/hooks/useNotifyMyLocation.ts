import { useCallback } from "react";
import { getMyLocationOnce } from "@/services/locationService";
import { useGeolocationWatcher } from ".";
import apiClient from "@/services/apiClient";

interface SOSMessage {
  uuid: string;
  location: { latitude: number; longitude: number; accuracy?: number };
  timestamp: number;
}

export function useNotifyMyLocation() {
  const { position, isReady } = useGeolocationWatcher({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 60000,
    throttleMs: 5000,
  });

  const notifyAllMyLocation = useCallback(
    async (uuid: string) => {
      let coords = position?.coords;

      if (!coords) {
        const pos = await getMyLocationOnce({
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000,
        });
        coords = pos.coords;
      }

      const message: SOSMessage = {
        uuid,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        },
        timestamp: Date.now(),
      };

      await apiClient.notifyAll(message);
    },
    [position]
  );

  return { notifyAllMyLocation, position, isReady };
}
