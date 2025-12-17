import { useThemeManager } from "@/hooks";

import PWABadge from "./PWABadge";
import InstallButton from "./InstallButton";
import ConnectForm from "./ConnectForm";
import MyLocation from "./MyLocation";
import { NotificationsProvider, useNotificationsContext } from "@/context";
import Loader from "./Loader";
import MessagesLog from "./MessagesLog";
import SOSButton from "./SOSButton";

function App() {
  useThemeManager();

  return (
    <>
      <PWABadge />
      <InstallButton />
      <NotificationsProvider>
        <ConnectForm />
        <AppContent />
      </NotificationsProvider>
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
