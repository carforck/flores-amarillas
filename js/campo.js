/**
 * Genera el campo que inunda el fondo: flores, luciérnagas y pétalos.
 *
 * Todo el movimiento lo lleva CSS. Desde aquí sólo se escribe una variable,
 * --floracion, con el avance de la canción: de 0 (empieza pelado) a 1 (el
 * fondo desbordado de amarillo). Es un número por frame para cientos de
 * elementos, así que el navegador sólo recalcula transformadas.
 */

/**
 * La flor, dibujada una vez.
 *
 * Va codificada con encodeURIComponent: un SVG metido crudo en un data URI
 * no es una imagen válida y el navegador acaba pintando trozos del código
 * como si fueran letras.
 *
 * Y se declara UNA sola vez en #campo, no en cada elemento: si cada flor
 * llevara el SVG entero en su atributo style, el HTML pesaría cien veces más
 * para dibujar exactamente lo mismo.
 */
function petaloSVG({ centro = "#f0a500", petalo = "#ffd11a", brillo = "#fff0a8" } = {}) {
  const petalos = [0, 72, 144, 216, 288].map(a =>
    `<ellipse cx="12" cy="6.2" rx="3.5" ry="5.6" fill="url(#p)" transform="rotate(${a} 12 12)"/>`
  ).join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">` +
      // El brillo sólo en la punta: si ocupa medio pétalo, la flor se lava y
      // a tamaño pequeño se lee como una estrella blanca, no como una flor.
      `<defs><radialGradient id="p" cx="50%" cy="18%">` +
        `<stop offset="0%" stop-color="${brillo}"/>` +
        `<stop offset="38%" stop-color="${petalo}"/>` +
        `<stop offset="100%" stop-color="#f7b500"/>` +
      `</radialGradient></defs>` +
      petalos +
      `<circle cx="12" cy="12" r="2.9" fill="${centro}"/>` +
      `<circle cx="12" cy="12" r="1.5" fill="${brillo}" opacity=".75"/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const azar = (min, max) => min + Math.random() * (max - min);
const elige = lista => lista[Math.floor(Math.random() * lista.length)];

/**
 * Tres capas de profundidad. Las de atrás son muchas, pequeñas y apagadas;
 * las de delante, pocas y grandes. Sin esa diferencia no hay fondo, hay
 * un mosaico plano.
 */
const CAPAS = [
  { nombre: "lejos", cuantas: 52, tam: [11, 24], y: [14, 50], op: [0.38, 0.6], giro: [1.5, 4] },
  { nombre: "medio", cuantas: 30, tam: [24, 44], y: [4, 28],  op: [0.62, 0.85], giro: [2, 5] },
  { nombre: "cerca", cuantas: 14, tam: [44, 84], y: [-6, 12], op: [0.85, 1],   giro: [2.5, 6] },
];

function brotes() {
  const trozos = [];
  for (const capa of CAPAS) {
    for (let i = 0; i < capa.cuantas; i++) {
      // Umbral escalonado: las de atrás abren primero y las de delante al
      // final, así el campo parece venir hacia ti según avanza la canción.
      const base = capa.nombre === "lejos" ? 0 : capa.nombre === "medio" ? 0.25 : 0.5;
      const estilo = [
        `--x:${azar(-4, 100).toFixed(2)}%`,
        `--y:${azar(...capa.y).toFixed(2)}%`,
        `--tam:${azar(...capa.tam).toFixed(1)}px`,
        `--op:${azar(...capa.op).toFixed(2)}`,
        `--giro:${azar(...capa.giro).toFixed(1)}deg`,
        `--vaiven:${azar(3.2, 7.5).toFixed(2)}s`,
        `--desfase:-${azar(0, 6).toFixed(2)}s`,
        `--umbral:${(base + Math.random() * 0.4).toFixed(3)}`,
      ].join(";");
      trozos.push(`<i class="brote capa--${capa.nombre}" style="${estilo}"></i>`);
    }
  }
  return trozos.join("");
}

function luciernagas(cuantas = 22) {
  return Array.from({ length: cuantas }, () => {
    const estilo = [
      `--x:${azar(0, 100).toFixed(2)}%`,
      `--y:${azar(4, 70).toFixed(2)}%`,
      `--tam:${azar(3, 8).toFixed(1)}px`,
      `--op:${azar(0.5, 1).toFixed(2)}`,
      `--dx:${azar(-60, 60).toFixed(0)}px`,
      `--dy:${azar(-70, 30).toFixed(0)}px`,
      `--vaiven:${azar(6, 14).toFixed(1)}s`,
      `--desfase:-${azar(0, 10).toFixed(1)}s`,
    ].join(";");
    return `<i class="luciernaga" style="${estilo}"></i>`;
  }).join("");
}

function petalos(cuantas = 14) {
  return Array.from({ length: cuantas }, () => {
    const estilo = [
      `--x:${azar(-5, 100).toFixed(2)}%`,
      `--tam:${azar(9, 20).toFixed(1)}px`,
      `--op:${azar(0.35, 0.8).toFixed(2)}`,
      `--dx:${azar(-120, 120).toFixed(0)}px`,
      `--vaiven:${azar(9, 20).toFixed(1)}s`,
      `--desfase:-${azar(0, 18).toFixed(1)}s`,
    ].join(";");
    return `<i class="petalo" style="${estilo}"></i>`;
  }).join("");
}

/** Pinta el campo. Devuelve el elemento para que lo maneje quien llame. */
export function montarCampo(selector = "#campo") {
  const raiz = document.querySelector(selector);
  if (!raiz) return null;
  // Una sola declaración de la flor para todo el campo; las hijas la heredan.
  raiz.style.setProperty("--petalo", petaloSVG());
  raiz.innerHTML = brotes() + luciernagas() + petalos();
  return raiz;
}

/**
 * Conecta la floración al avance de la canción.
 * `fin` es el segundo en que debe estar el campo completamente abierto.
 */
export function florecerCon(audio, raiz, fin, { alDesbordar } = {}) {
  if (!audio || !raiz) return () => {};
  let id = null;
  let desbordado = false;

  // Se arranca desde el suelo que ya tiene la portada, no desde cero: si no,
  // al empezar la canción el campo se cerraría de golpe antes de volver a abrir.
  const SUELO = 0.18;

  const paso = () => {
    const avance = Math.min(1, Math.max(0, audio.currentTime / fin));
    const p = SUELO + (1 - SUELO) * avance;
    raiz.style.setProperty("--floracion", p.toFixed(4));
    if (!desbordado && avance >= 0.92) {
      desbordado = true;
      alDesbordar?.();
    }
    id = requestAnimationFrame(paso);
  };
  paso();
  return () => { if (id !== null) cancelAnimationFrame(id); };
}
