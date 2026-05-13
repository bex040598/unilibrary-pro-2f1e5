import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || "4173");
const distRoot = join(process.cwd(), "frontend", "dist");

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

const server = createServer(async (request, response) => {
  const filePath = resolveFilePath(request.url || "/");
  const extension = extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  try {
    if (filePath.endsWith("index.html")) {
      const html = await readFile(filePath);
      response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
      response.end(html);
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
});
