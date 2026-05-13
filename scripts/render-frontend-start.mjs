import { spawnSync } from "node:child_process";

const port = process.env.PORT || "4173";
const env = { ...process.env };

if (!env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS && env.RENDER_EXTERNAL_HOSTNAME) {
  env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS = env.RENDER_EXTERNAL_HOSTNAME;
}

const result = spawnSync(
  "npm",
  ["--prefix", "frontend", "run", "preview", "--", "--host", "0.0.0.0", "--port", port],
  {
    stdio: "inherit",
    env,
    shell: process.platform === "win32"
  }
);

process.exit(result.status ?? 1);
