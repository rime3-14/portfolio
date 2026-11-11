import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const directory = fileURLToPath(new URL("../out/", import.meta.url));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const port = Number(process.env.PORT ?? "3000");
const host = "127.0.0.1";
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!existsSync(resolve(directory, "index.html"))) {
  throw new Error("Run npm run build to create the static export before starting preview.");
}

async function file(pathname) {
  const filename = resolve(directory, "." + pathname);
  if (!filename.startsWith(resolve(directory) + sep) && filename !== resolve(directory)) return;
  try {
    const entry = await stat(filename);
    if (entry.isFile()) return filename;
    if (entry.isDirectory()) {
      const index = resolve(filename, "index.html");
      if ((await stat(index)).isFile()) return index;
    }
  } catch (error) {
    if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
  }
}

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  try {
    const url = new URL(request.url, "http://" + host);
    const pathname = decodeURIComponent(url.pathname);
    const inScope = !basePath || pathname === basePath || pathname.startsWith(basePath + "/");
    const match = inScope ? await file(pathname.slice(basePath.length) || "/") : undefined;
    if (match?.endsWith(sep + "index.html") && !pathname.endsWith("/") && !pathname.endsWith(".html")) {
      response.writeHead(308, { Location: url.pathname + "/" + url.search }).end();
      return;
    }
    const filename = match ?? resolve(directory, "404.html");
    response.writeHead(match ? 200 : 404, {
      "Content-Type": mime[extname(filename)] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filename).on("error", () => response.destroy()).pipe(response);
  } catch {
    if (!response.headersSent) response.writeHead(400).end("Invalid request");
    else response.destroy();
  }
}).listen(port, host, () => {
  console.log("Portfolio preview at http://" + host + ":" + port + basePath + "/");
});

