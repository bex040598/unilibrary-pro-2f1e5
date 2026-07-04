import { spawnSync } from "node:child_process";

const BACKEND_URL = "https://atmu-unilibrary-api.onrender.com";
const apiBaseUrl = process.env.VITE_API_BASE_URL?.trim() || BACKEND_URL;

console.log(`Netlify build using API base: ${apiBaseUrl}`);

const result = spawnSync("npm", ["--prefix", "frontend", "run", "build"], {
  stdio: "inherit",
  env: { ...process.env, VITE_API_BASE_URL: apiBaseUrl },
  shell: process.platform === "win32"
});

process.exit(result.status ?? 1);
