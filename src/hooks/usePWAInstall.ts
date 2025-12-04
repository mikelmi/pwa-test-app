import { useEffect, useState } from "react";

// Тип для події beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setInstalled] = useState(false);

  // Перевірка, чи додаток вже встановлено
  const checkInstalled = () => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iOS = (window.navigator as any).standalone === true;

    setInstalled(standalone || iOS);
  };

  useEffect(() => {
    checkInstalled();

    const beforeInstallHandler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault(); // блокуємо автоматичний банер
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const appInstalledHandler = () => {
      setInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      beforeInstallHandler as EventListener
    );
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallHandler as EventListener
      );
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  // Виклик системного діалогу установки
  const installPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;
    console.log("PWA install result:", result.outcome);

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstalled, isInstallable, installPWA };
}
