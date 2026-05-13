import { spawnSync } from "node:child_process";

const apiHost = process.env.RENDER_API_HOST?.trim();

if (!process.env.VITE_API_BASE_URL && apiHost) {
  process.env.VITE_API_BASE_URL = apiHost.startsWith("http")
    ? apiHost
    : `https://${apiHost}`;
}

if (!process.env.VITE_API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not set. Provide it directly or set RENDER_API_HOST in Render."
  );
}

console.log(`Building frontend with API base: ${process.env.VITE_API_BASE_URL}`);

const result = spawnSync("npm", ["--prefix", "frontend", "run", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32"
});

process.exit(result.status ?? 1);

