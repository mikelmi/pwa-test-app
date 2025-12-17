import { useContext } from "react";
import { MapModalContext } from "./mapModel.context";

export function useMapModalContext() {
  return useContext(MapModalContext);
}
