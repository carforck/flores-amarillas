/**
 * Servidor de desarrollo. El de python no implementa peticiones Range, así que
 * el navegador no puede saltar dentro del mp3 y la navegación entre fotos se
 * rompe. Este sí las implementa.
 */
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const RAIZ = process.cwd();
const PUERTO = Number(process.argv[2] ?? 8777);
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".mp3": "audio/mpeg", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".avif": "image/avif", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const ruta = join(RAIZ, normalize(url === "/" ? "/index.html" : url));
  if (!ruta.startsWith(RAIZ)) return res.writeHead(403).end();

  let info;
  try { info = statSync(ruta); } catch { return res.writeHead(404).end("no está"); }
  if (info.isDirectory()) return res.writeHead(404).end("no está");

  const tipo = TIPOS[extname(ruta).toLowerCase()] ?? "application/octet-stream";
  const rango = req.headers.range;

  if (rango) {
    const m = /bytes=(\d*)-(\d*)/.exec(rango);
    const inicio = m[1] ? +m[1] : 0;
    const fin = m[2] ? +m[2] : info.size - 1;
    if (inicio >= info.size) {
      return res.writeHead(416, { "Content-Range": `bytes */${info.size}` }).end();
    }
    res.writeHead(206, {
      "Content-Type": tipo,
      "Content-Range": `bytes ${inicio}-${fin}/${info.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": fin - inicio + 1,
      "Cache-Control": "no-cache",
    });
    return createReadStream(ruta, { start: inicio, end: fin }).pipe(res);
  }

  res.writeHead(200, {
    "Content-Type": tipo,
    "Content-Length": info.size,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
  });
  createReadStream(ruta).pipe(res);
}).listen(PUERTO, () => console.log(`http://localhost:${PUERTO}`));
