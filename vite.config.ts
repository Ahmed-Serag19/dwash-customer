import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // This will replace process.env with an empty object at build time
    // which prevents errors with process.env access
    "process.env": {},
    // Add global to window
    global: "window",
  },
});
