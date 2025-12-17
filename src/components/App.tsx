import { useThemeManager } from "@/hooks";

import PWABadge from "./PWABadge";
import InstallButton from "./InstallButton";
import ConnectForm from "./ConnectForm";
import MyLocation from "./MyLocation";
import {
  MapModalProvider,
  NotificationsProvider,
  useNotificationsContext,
} from "@/context";
import Loader from "./Loader";
import MessagesLog from "./MessagesLog";
import SOSButton from "./SOSButton";
import MapModal from "./MapModal/MapModal";

function App() {
  useThemeManager();

  return (
    <>
      <PWABadge />
      <InstallButton />
      <MapModalProvider>
        <NotificationsProvider>
          <ConnectForm />
          <AppContent />
        </NotificationsProvider>
      </MapModalProvider>
    </>
  );
}

function AppContent() {
  const { isConnected, isLoading, error } = useNotificationsContext();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!isConnected) {
    return null;
  }

  return (
    <>
      <MyLocation />
      <SOSButton />
      <MessagesLog />
      <MapModal />
    </>
  );
}

export default App;
