import { spawnSync } from "node:child_process";

const port = process.env.PORT || "4173";

const result = spawnSync(
  "npm",
  ["--prefix", "frontend", "run", "preview", "--", "--host", "0.0.0.0", "--port", port],
  {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32"
  }
);

process.exit(result.status ?? 1);
