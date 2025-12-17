export async function getMyLocationOnce(
  opts: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 10000,
  }
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Сервіс геолокації недоступний"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}
