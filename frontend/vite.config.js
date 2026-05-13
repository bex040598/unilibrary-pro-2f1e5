var _a, _b;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
var processEnv = (_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.env) !== null && _b !== void 0 ? _b : {};
var additionalAllowedHosts = (processEnv.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS || "")
    .split(",")
    .map(function (value) { return value.trim(); })
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
