import { useState, type ChangeEvent, type FormEvent } from "react";
import Loader from "../Loader";

import "./ConnectForm.css";
import { useNotificationsContext } from "@/context";

export default function ConnectForm() {
  const {
    isConnected,
    isSupported,
    connect,
    disconnect,
    error,
    isLoading,
    uuid,
  } = useNotificationsContext();

  const [uuidValue, setUuidValue] = useState<string>("");

  if (!isSupported) {
    return (
      <div className="error block">
        Неможливо підключитись. Встановіть додаток
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="block">
        <b>UUID:</b> {uuid}
        <button type="button" onClick={disconnect}>
          Від'єднатись
        </button>
      </div>
    );
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uuidValue.trim()) {
      return;
    }

    connect(uuidValue.trim());
  };

  const handleUUIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUuidValue(event.target.value);
  };

  const disabled = isLoading || !uuidValue.trim();

  return (
    <form onSubmit={handleFormSubmit} className="block">
      <div className="field">
        <input
          name="UUID"
          type="text"
          placeholder="UUID"
          width={200}
          disabled={isLoading}
          required
          value={uuidValue}
          onChange={handleUUIDChange}
        />
        <button type="submit" disabled={disabled}>
          Під'єднатись
        </button>
        {isLoading && <Loader size={12} />}
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
