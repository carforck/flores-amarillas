/**
 * Prepara las fotos. Se ejecuta a mano (`npm run fotos`); lo que se publica
 * no lleva build: aquí sólo se generan archivos que luego se commitean.
 *
 *   photos/originales/*.{jpg,png,heic}  ->  photos/opt/<nombre>-<ancho>.{avif,webp,jpg}
 *
 * Además imprime el bloque `fotos: [...]` listo para pegar en js/config.js,
 * con el placeholder borroso ya incrustado en base64.
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";
import { join, parse } from "node:path";

const ORIGEN = "photos/originales";
const DESTINO = "photos/opt";
const ANCHOS = [480, 900, 1400];
const CALIDAD = { avif: 55, webp: 72, jpeg: 80 };

const esImagen = f => /\.(jpe?g|png|webp|heic|heif|tiff?)$/i.test(f);

const REGISTRO = "photos/nombres.json";

/**
 * Nombres estables.
 *
 * Si renombras el original con algo con sentido ("primera-cita.jpg") se
 * respeta. Si es un hash de Instagram, se le asigna foto-NN Y SE GUARDA en
 * photos/nombres.json, para que conserve su número aunque más adelante
 * añadas una foto cuyo nombre ordene antes.
 *
 * Sin ese registro, meter una foto nueva renumeraba a todas y los pies de
 * foto de config.js acababan puestos en la imagen equivocada.
 */
async function cargarRegistro() {
  try { return JSON.parse(await readFile(REGISTRO, "utf8")); } catch { return {}; }
}

function asignarNombres(archivos, registro) {
  const usados = new Set(Object.values(registro));
  let siguiente = 1;
  const libre = () => {
    let n;
    do { n = `foto-${String(siguiente++).padStart(2, "0")}`; } while (usados.has(n));
    usados.add(n);
    return n;
  };

  for (const archivo of archivos) {
    if (registro[archivo]) continue;
    const base = parse(archivo).name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const esHash = base.length > 24 || /^[\d-]+$/.test(base);
    registro[archivo] = esHash ? libre() : base;
  }
  return registro;
}

/** Miniatura de 16px en base64: se pinta borrosa mientras carga la de verdad. */
async function placeholder(entrada) {
  const buf = await sharp(entrada).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  await mkdir(DESTINO, { recursive: true });

  let archivos = [];
  try {
    archivos = (await readdir(ORIGEN)).filter(esImagen).sort();
  } catch {
    console.error(`No existe ${ORIGEN}/. Créalo y mete ahí las fotos originales.`);
    process.exit(1);
  }

  if (!archivos.length) {
    console.error(`${ORIGEN}/ está vacío. Mete las fotos y vuelve a ejecutar.`);
    process.exit(1);
  }

  const registro = asignarNombres(archivos, await cargarRegistro());
  await writeFile(REGISTRO, JSON.stringify(registro, null, 2) + "\n");

  const entradas = [];

  for (const archivo of archivos) {
    const entrada = join(ORIGEN, archivo);
    const nombre = registro[archivo];
    const img = sharp(entrada).rotate();               // respeta la orientación EXIF
    const { width, height } = await img.metadata();

    const anchos = ANCHOS.filter(a => a <= width);
    if (!anchos.length) anchos.push(width);            // foto pequeña: se deja tal cual

    for (const ancho of anchos) {
      const base = sharp(entrada).rotate().resize({ width: ancho, withoutEnlargement: true });
      await Promise.all([
        base.clone().avif({ quality: CALIDAD.avif }).toFile(`${DESTINO}/${nombre}-${ancho}.avif`),
        base.clone().webp({ quality: CALIDAD.webp }).toFile(`${DESTINO}/${nombre}-${ancho}.webp`),
        base.clone().jpeg({ quality: CALIDAD.jpeg, mozjpeg: true }).toFile(`${DESTINO}/${nombre}-${ancho}.jpg`),
      ]);
    }

    entradas.push({
      nombre,
      anchos,
      ratio: +(width / height).toFixed(4),
      lqip: await placeholder(entrada),
      alt: "",
      caption: "",
    });
    console.log(`  ✓ ${archivo}  ->  ${anchos.join("/")}px  (${width}x${height})`);
  }

  // Bloque listo para pegar en config.js
  const bloque = "export const fotos = [\n" + entradas.map(e =>
`  {
    nombre: "${e.nombre}",
    anchos: [${e.anchos.join(", ")}],
    ratio: ${e.ratio},
    alt: "${e.alt}",
    caption: "${e.caption}",
    lqip: "${e.lqip}",
  },`).join("\n") + "\n];\n";

  await writeFile("photos/fotos.generado.js", bloque);
  console.log(`\n${entradas.length} fotos listas.`);
  console.log("Bloque escrito en photos/fotos.generado.js — pega su contenido en js/config.js");
  console.log("y rellena `alt` y `caption` de cada una.");
}

main();
