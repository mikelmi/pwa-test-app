import { useEffect } from "react";

export function useThemeManager() {
  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    metaThemeColor?.setAttribute(
      "content",
      prefersDark.matches ? "#2b3544" : "#f0f4f8"
    );

    prefersDark.addEventListener("change", (e) => {
      metaThemeColor?.setAttribute(
        "content",
        e.matches ? "#2b3544" : "#f0f4f8"
      );
    });
  }, []);
}
