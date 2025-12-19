import { useState } from "react";
import { MapModalContext, type MapModel } from "./mapModel.context";

export default function MapModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [model, setMapModel] = useState<MapModel | null>(null);

  return (
    <MapModalContext.Provider
      value={{
        model,
        openModal: (newModel) => setMapModel(newModel),
        closeModal: () => setMapModel(null),
      }}
    >
      {children}
    </MapModalContext.Provider>
  );
}
