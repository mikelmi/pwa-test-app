import { useNotificationsContext } from "@/context";
import { useNotifyMyLocation } from "@/hooks/useNotifyMyLocation";
import { useState } from "react";

export default function SOSButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { uuid } = useNotificationsContext();

  const { notifyAllMyLocation, position, isReady } = useNotifyMyLocation();

  const handleClick = async () => {
    if (!uuid) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await notifyAllMyLocation(uuid);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || !isReady || !position;

  return (
    <>
      <button type="button" onClick={handleClick} disabled={disabled}>
        SOS
      </button>
      {error && <div className="error">{error}</div>}
    </>
  );
}
