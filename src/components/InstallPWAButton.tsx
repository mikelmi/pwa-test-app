import { usePWAInstall } from "../hooks/usePWAInstall";

export default function InstallPWAButton() {
  const { isInstalled, isInstallable, installPWA } = usePWAInstall();

  if (!isInstallable || isInstalled) {
    return null;
  }

  return <button onClick={installPWA}>Install App</button>;
}
