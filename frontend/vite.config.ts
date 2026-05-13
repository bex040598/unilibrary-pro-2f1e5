import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const processEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const additionalAllowedHosts = (processEnv.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    allowedHosts: additionalAllowedHosts
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: additionalAllowedHosts
  }
});
