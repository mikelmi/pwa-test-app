import { useEffect, useRef, useState } from "react";

export interface LocationWatcherOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  throttleMs?: number; // мінімальний інтервал між оновленнями стану
}

export interface LocationState {
  position: GeolocationPosition | null;
  error: string | null;
  isReady: boolean;
}

export function useGeolocationWatcher(
  options: LocationWatcherOptions = {}
): LocationState {
  const {
    enableHighAccuracy = true,
    timeout = 20000,
    maximumAge = 60000,
    throttleMs = 5000,
  } = options;

  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const lastUpdateRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Сервіс геолокації недоступний");
      return;
    }

    const onSuccess = (pos: GeolocationPosition) => {
      const now = Date.now();
      if (now - lastUpdateRef.current >= throttleMs) {
        setPosition(pos);
        setError(null);
        setIsReady(true);
        lastUpdateRef.current = now;
      }
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    const id = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enableHighAccuracy, timeout, maximumAge, throttleMs]);

  return { position, error, isReady };
}
