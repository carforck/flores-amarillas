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

export const cierre = {
  titulo: "Y hasta aquí, mi amor",
  texto: [
    "Tres fotos, una canción y un jardín que florece para ti.",
    "Lo de siempre: te amo.",
  ],
};

export const instagram = {
  usuario: "made_hm_17",
  perfil: "https://www.instagram.com/made_hm_17/",
  avatar: "img/avatar.jpg",   // opcional; si no existe se pinta un degradado
  pie: "hace un ratito",
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
 * FOTOS. Las genera `npm run fotos` desde photos/originales/.
 * `alt` describe la imagen para quien no la ve; `caption` es el pie del post.
 * El reparto en la canción es automático (js/stories.js), pero puedes fijarlo
 * con `t` si quieres que una foto caiga en un verso concreto.
 */
export const fotos = [
  {
    nombre: "foto-01",
    anchos: [480, 900, 1400],
    ratio: 0.75,
    alt: "Los dos en la playa al atardecer, frente a frente, con una flor en tu pelo",
    caption: "El mar, el atardecer y tú. No hacía falta nada más.",
    lqip: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQAgCdASoMABAAA4BaJbACdADcou4QXxgAAP3VP0AhtFwLbxWZyhiwMqUoPoE2yoddLDD9hjG6e5v0r9eGhrP0wuln9NSnyL3hIA0ws3L5Ra7wakatAAAA",
  },
  {
    nombre: "foto-02",
    anchos: [480, 900, 1400],
    ratio: 1,
    alt: "Los dos muy juntos, de noche, entre luces cálidas y con corona de flores",
    caption: "Contigo hasta una noche cualquiera se vuelve fiesta.",
    lqip: "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAADwAQCdASoQABAAA4BaJbACdACC9noTsgAA+4T+Q3mqg7Z3bxSeHeAUO00K22TUBo5fIKuCsaxXn0CHOSHO8FD5o3bP/dP3a3IXknvu+DJQgm1t5fNj69UwNDncZm8tnY+RnewYAAA=",
  },
  {
    nombre: "foto-03",
    anchos: [480, 900, 1400],
    ratio: 0.75,
    alt: "Los dos sentados dentro de un corazón gigante de madera, con la montaña detrás",
    caption: "Encontramos un corazón enorme en la montaña. Seguía siendo más pequeño que el mío.",
    lqip: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwAgCdASoMABAAA4BaJZACdADbp2qzvVIkAAD4tKWuK3DTqk3FbCwIxrao5XxXDKFSr536QFD34xffkL9Yd4fJkBou7H+VGvUouc7HKwFJhj6AAAA=",
  },
];

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
