import { createContext } from "react";
import type { LocationPosition } from "@/types";

export type MapModel = {
  uuid?: string | null;
  location: LocationPosition;
};
export interface MapModalContextType {
  model: MapModel | null;
  openModal: (model: MapModel) => void;
  closeModal: () => void;
}

export const MapModalContext = createContext<MapModalContextType>(
  null as unknown as MapModalContextType
);
