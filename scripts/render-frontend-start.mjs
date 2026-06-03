import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || "4173");
const distRoot = join(process.cwd(), "frontend", "dist");
const runtimeApiBaseUrl =
  process.env.VITE_API_BASE_URL?.trim() ||
  (process.env.RENDER_API_HOST?.trim()
    ? `https://${process.env.RENDER_API_HOST.trim().replace(/^https?:\/\//, "")}`
    : "");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

if (!existsSync(join(distRoot, "index.html"))) {
  console.error("frontend/dist/index.html topilmadi. Avval build bajarilishi kerak.");
  process.exit(1);
}

function resolveFilePath(urlPath) {
  const cleaned = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  if (cleaned === "/" || cleaned === ".") {
    return join(distRoot, "index.html");
  }
  const absoluteFile = join(distRoot, cleaned);
  return existsSync(absoluteFile) ? absoluteFile : join(distRoot, "index.html");
}

async function handleApiProxy(request, response) {
  if (!runtimeApiBaseUrl) {
    response.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ detail: "Backend API manzili sozlanmagan." }));
    return;
  }

  const targetUrl = `${runtimeApiBaseUrl}${request.url.replace(/^\/api/, "")}`;
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string" && key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  }

  const hasBody = !["GET", "HEAD"].includes(request.method || "GET");
  const bodyBuffer = hasBody
    ? await new Promise((resolve, reject) => {
        const chunks = [];
        request.on("data", (chunk) => chunks.push(chunk));
        request.on("end", () => resolve(Buffer.concat(chunks)));
        request.on("error", reject);
      })
    : undefined;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: bodyBuffer
    });

    response.writeHead(upstreamResponse.status, Object.fromEntries(upstreamResponse.headers.entries()));
    const buffer = Buffer.from(await upstreamResponse.arrayBuffer());
    response.end(buffer);
  } catch (error) {
    response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    response.end(
      JSON.stringify({
        detail: error instanceof Error ? error.message : "Backend API ga ulanishda xato."
      })
    );
  }
}

function injectRuntimeConfig(html) {
  const runtimeValue = runtimeApiBaseUrl ? "/api" : "";
  const runtimeScript = `<script>window.__ATMU_RUNTIME_CONFIG__={apiBaseUrl:${JSON.stringify(runtimeValue)}};</script>`;
  return html.includes("</head>") ? html.replace("</head>", `${runtimeScript}</head>`) : `${runtimeScript}${html}`;
}

const server = createServer(async (request, response) => {
  if ((request.url || "").startsWith("/api/") || request.url === "/api") {
    await handleApiProxy(request, response);
    return;
  }

  const filePath = resolveFilePath(request.url || "/");
  const extension = extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  try {
    if (filePath.endsWith("index.html")) {
      const html = await readFile(filePath, "utf8");
      response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
      response.end(injectRuntimeConfig(html));
      return;
    }

    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Unknown server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`ATMU frontend static server running on port ${port}`);
  if (runtimeApiBaseUrl) {
    console.log(`Runtime API proxy active -> ${runtimeApiBaseUrl}`);
  } else {
    console.log("Runtime API proxy topilmadi. Frontend /api so'rovlari ishlamaydi.");
  }
});
