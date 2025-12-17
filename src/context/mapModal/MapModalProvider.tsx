import type { SOSMessage } from "@/types";
import { useState } from "react";
import { MapModalContext } from "./mapModel.context";

export default function MapModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMessage, setSelectedMessage] = useState<SOSMessage | null>(
    null
  );

  return (
    <MapModalContext.Provider
      value={{
        selectedMessage,
        openModal: (msg) => setSelectedMessage(msg),
        closeModal: () => setSelectedMessage(null),
      }}
    >
      {children}
    </MapModalContext.Provider>
  );
}
