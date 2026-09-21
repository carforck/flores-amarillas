/**
 * Fuente única de verdad del proyecto.
 * Todo el contenido vive aquí: nadie debería tocar HTML para cambiar un texto,
 * una foto, una línea de la canción o la forma del jardín.
 */

export const persona = {
  nombre: "Madenlay",
  apodo: "mi flaca hermosa",
  fecha: "21 de septiembre",
};

export const portada = {
  titulo: `Para ti, ${persona.apodo}!`,
  // Frases del efecto máquina de escribir.
  frases: [
    "✨ Eres la razón de mis sonrisas ✨",
    "💖 Mi mundo es más bonito contigo 💖",
    "🌹 Siempre serás mi mejor regalo 🌹",
  ],
  descripcion: [
    `Hoy quiero enmendar lo que faltó el ${persona.fecha},`,
    "porque eres lo más especial en mi vida,",
    "y siempre lo serás.",
  ],
  cta: "Presióname Amor! 💖",
};

export const audio = {
  src: "sound/Floricienta.mp3",
  // Los navegadores bloquean autoplay con sonido: hace falta un gesto del
  // usuario. El botón de la portada cuenta como ese gesto y lo propagamos.
  titulo: "Flores amarillas — Floricienta",
};

/**
 * Letra sincronizada. `t` = segundo de entrada, `dur` = cuánto permanece.
 * Antes todas duraban 6s fijos y se solapaban; ahora cada una declara lo suyo.
 */
export const letra = [
  { t: 5,  dur: 2, text: "Aquí están tus flores, mi amor" },
  { t: 7,  dur: 8, text: `TE AMO, ${persona.nombre.toUpperCase()}` },
  { t: 16, dur: 7, text: "Él la estaba esperando con una flor amarilla" },
  { t: 24, dur: 6, text: "Ella lo estaba soñando con la luz en su pupila" },
  { t: 31, dur: 8, text: "Y el amarillo del sol iluminaba la esquina" },
  { t: 40, dur: 5, text: "Lo sentía tan cercano, lo sentía desde niña" },
  { t: 46, dur: 5, text: "Ella sabía que él sabía, que algún día pasaría" },
  { t: 51, dur: 6, text: "Que vendría a buscarla con sus flores amarillas" },
  { t: 57, dur: 5, text: "No te apures, no detengas el instante del encuentro" },
  { t: 62, dur: 4, text: "Está dicho que es un hecho, no la pierdas, no hay derecho" },
  { t: 66, dur: 4, text: "No te olvides, que la vida" },
  { t: 70, dur: 5, text: "Casi nunca está dormida" },
  { t: 75, dur: 8, text: "Te amo mi amor, aquí están tus flores amarillas" },
];

/**
 * FOTOS — pendiente de cargar.
 * Cada entrada: { file, alt, caption, fecha, t?, focus? }
 *   t     -> segundo de la canción en que aparece (opcional)
 *   focus -> punto focal para el recorte, ej. "50% 30%"
 * Las rutas apuntan a photos/opt/, que genera `npm run fotos`.
 */
export const fotos = [];

/**
 * Geometría del jardín. Antes: 333 líneas de HTML repetido escrito a mano.
 * Ahora: esto.
 */
export const jardin = {
  flores: [
    { lineLeafs: 6 },
    { lineLeafs: 4 },
    { lineLeafs: 4 },
  ],
  hierbaCreciente: 2,
  gLong: ["1.2s"],
  gRight: ["2.4s", "2.8s"],
  gFront: { delay: "2.8s", hojas: 8 },
  gFr: { delay: "3.2s", hojas: 8 },
  // Un array de 4 retardos por cada mata larga.
  longG: [
    ["3s",   "2.2s", "3.4s", "3.6s"],
    ["3.6s", "3.8s", "4s",   "4.2s"],
    ["4s",   "4.2s", "4.4s", "4.6s"],
    ["4s",   "4.2s", "3s",   "3.6s"],
    ["4s",   "4.2s", "3s",   "3.6s"],
    ["4s",   "4.2s", "3s",   "3.6s"],
    ["4.2s", "4.4s", "4.6s", "4.8s"],
    ["3s",   "3.2s", "3.5s", "3.6s"],
  ],
};
