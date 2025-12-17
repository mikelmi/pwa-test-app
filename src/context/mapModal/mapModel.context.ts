import { createContext } from "react";
import type { SOSMessage } from "@/types";

export interface MapModalContextType {
  selectedMessage: SOSMessage | null;
  openModal: (msg: SOSMessage) => void;
  closeModal: () => void;
}

export const MapModalContext = createContext<MapModalContextType>(
  null as unknown as MapModalContextType
);
