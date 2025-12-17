import { useGeolocationWatcher } from "@/hooks";

export default function MyLocation() {
  const { position, error } = useGeolocationWatcher();

  return (
    <div>
      <b>Місцезнаходження:</b>{" "}
      {position && (
        <span>
          Широта: {position.coords.latitude}, Довгота:{" "}
          {position.coords.longitude}
        </span>
      )}{" "}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
