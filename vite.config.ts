import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon/*", "assets/*", "gongs/*.mp3", "snowflake.svg"],
      manifest: {
        name: "My Yoga Practice",
        short_name: "My Yoga Practice",
        description:
          "Automated sequences, background time tracking, and gong sounds for a seamless, distraction-free yoga practice.",
        theme_color: "#000000",
        icons: [
          {
            src: "favicon/android-chrome-512x512.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
