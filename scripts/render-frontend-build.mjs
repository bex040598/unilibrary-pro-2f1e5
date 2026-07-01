import { spawnSync } from "node:child_process";

const apiHost = process.env.RENDER_API_HOST?.trim();

if (!process.env.VITE_API_BASE_URL && apiHost) {
  process.env.VITE_API_BASE_URL = apiHost.startsWith("http")
    ? apiHost
    : `https://${apiHost}`;
}

if (!process.env.VITE_API_BASE_URL) {
  console.warn("VITE_API_BASE_URL not set — building in mock/offline mode");
  process.env.VITE_API_BASE_URL = "";
}

console.log(`Building frontend with API base: ${process.env.VITE_API_BASE_URL}`);

const result = spawnSync("npm", ["--prefix", "frontend", "run", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32"
});

process.exit(result.status ?? 1);

