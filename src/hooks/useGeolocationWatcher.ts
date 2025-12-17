import { useEffect, useState } from "react";

export function useGeolocationWatcher(intervalMs: number = 15000) {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation не підтримується");
      return;
    }

    let lastUpdate = 0;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastUpdate >= intervalMs) {
          setPosition(pos);
          lastUpdate = now;
        }
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        maximumAge: intervalMs, // кешування до інтервалу
        timeout: 20000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [intervalMs]);

  return { position, error };
}
