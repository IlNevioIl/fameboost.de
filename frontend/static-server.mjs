import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function safePath(url) {
  const clean = decodeURIComponent(url.split("?")[0]);
  const requested = clean.endsWith("/") ? `${clean}index.html` : clean;
  const file = normalize(join(root, requested));
  return file.startsWith(root) ? file : join(root, "index.html");
}

createServer(async (req, res) => {
  try {
    const file = safePath(req.url || "/");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`FameBoost.de running at http://127.0.0.1:${port}/`);
});
