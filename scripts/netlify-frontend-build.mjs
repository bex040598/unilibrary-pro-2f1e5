import { spawnSync } from "node:child_process";

const apiBaseUrl = process.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is required for Netlify builds. Set it in the Netlify site environment variables."
  );
}

console.log(`Netlify build using API base: ${apiBaseUrl}`);

const result = spawnSync("npm", ["--prefix", "frontend", "run", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32"
});

process.exit(result.status ?? 1);

