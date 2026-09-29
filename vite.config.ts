import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL?.trim();

  if (!backendUrl) {
    throw new Error("Missing VITE_BACKEND_URL. Configure it before building the frontend.");
  }

  const parsedBackendUrl = new URL(backendUrl);
  if (!["http:", "https:"].includes(parsedBackendUrl.protocol)) {
    throw new Error("VITE_BACKEND_URL must be a valid HTTP or HTTPS URL.");
  }

  return {
    plugins: [react(), tailwindcss()],
  };
});
