import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative paths, so the game works at its own domain or in a sub-folder.
  base: "./",
  plugins: [react()],
  server: {
    port: 5174,
  },
});
