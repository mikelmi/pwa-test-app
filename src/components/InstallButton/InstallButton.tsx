import { usePWAInstall } from "../../hooks/usePWAInstall";

export default function InstallButton() {
  const { isInstalled, isInstallable, installPWA } = usePWAInstall();

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <button type="button" onClick={installPWA} className="install-btn">
      Встановити додаток
    </button>
  );
}
