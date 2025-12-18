import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
//import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "pwa-test-app",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /*server: {
    host: true,
    port: 5173,
    https: {
      //key: readFileSync("certs/localhost+2-key.pem"),
      //cert: readFileSync("certs/localhost+2.pem"),
      key: readFileSync("certs/192.168.31.58-key.pem"),
      cert: readFileSync("certs/192.168.31.58.pem"),
    },
  },*/
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      strategies: "injectManifest",

      srcDir: "src",
      filename: "sw.ts",

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "pwa-test-app",
        short_name: "pwa-test-app",
        description: "pwa-test-app",
        theme_color: "#2b3544",
        background_color: "#2b3544",
        display: "standalone",
        orientation: "portrait",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
