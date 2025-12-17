import { useNotificationsContext } from "@/context";
import apiClient from "@/services/apiClient";
import { useState } from "react";

export default function SOSButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { uuid } = useNotificationsContext();

  const handleClick = async () => {
    if (!uuid) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.notifyAllMyLocation(uuid);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <button type="button" onClick={handleClick} disabled={isLoading}>
        SOS
      </button>
      {error && <div className="error">{error}</div>}
    </>
  );
}
