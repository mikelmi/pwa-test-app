import { useGeolocationWatcher } from "@/hooks";
import Loader from "../Loader";

export default function MyLocation() {
  const { position, error } = useGeolocationWatcher();

  const isLoading = !position && !error;

  return (
    <div className="row">
      <div>
        <b>Місцезнаходження:</b>
      </div>
      {isLoading && <Loader size={12} />}
      <div>
        {position && (
          <span>
            Широта: {position.coords.latitude}, Довгота:{" "}
            {position.coords.longitude}
          </span>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
