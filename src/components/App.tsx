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
import RefreshButton from "./RefreshButton/RefreshButton";

function App() {
  useThemeManager();

  return (
    <>
      <PWABadge />
      <div>
        <InstallButton /> <RefreshButton />
      </div>
      <MapModalProvider>
        <NotificationsProvider>
          <ConnectForm />
          <AppContent />
        </NotificationsProvider>

        <MapModal />
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
    </>
  );
}

export default App;
