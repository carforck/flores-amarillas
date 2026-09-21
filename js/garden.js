/**
 * Genera el jardín completo desde `jardin` (config.js).
 * Emite exactamente el mismo DOM que el flower.html original, así que el CSS
 * de las flores sigue funcionando sin tocar una sola regla.
 */
import { jardin } from "./config.js";

/** repetir(3, i => `<b>${i}</b>`) -> "<b>1</b><b>2</b><b>3</b>" (i empieza en 1) */
const repetir = (n, fn) => Array.from({ length: n }, (_, i) => fn(i + 1)).join("");

const crecer = (delay, contenido) =>
  `<div class="grow-ans" style="--d: ${delay}">${contenido}</div>`;

const flor = ({ lineLeafs }, idx) => { const n = idx + 1; return `
  <div class="flower flower--${n}">
    <div class="flower__leafs flower__leafs--${n}">
      ${repetir(4, i => `<div class="flower__leaf flower__leaf--${i}"></div>`)}
      <div class="flower__white-circle"></div>
      ${repetir(8, i => `<div class="flower__light flower__light--${i}"></div>`)}
    </div>
    <div class="flower__line">
      ${repetir(lineLeafs, i => `<div class="flower__line__leaf flower__line__leaf--${i}"></div>`)}
    </div>
  </div>`; };

const hierba = n => `
  <div class="growing-grass">
    <div class="flower__grass flower__grass--${n}">
      <div class="flower__grass--top"></div>
      <div class="flower__grass--bottom"></div>
      ${repetir(8, i => `<div class="flower__grass__leaf flower__grass__leaf--${i}"></div>`)}
      <div class="flower__grass__overlay"></div>
    </div>
  </div>`;

const gLong = delay => crecer(delay, `
  <div class="flower__g-long">
    <div class="flower__g-long__top"></div>
    <div class="flower__g-long__bottom"></div>
  </div>`);

const gRight = (delay, idx) => crecer(delay,
  `<div class="flower__g-right flower__g-right--${idx + 1}"><div class="leaf"></div></div>`);

const gFront = ({ delay, hojas }) => crecer(delay, `
  <div class="flower__g-front">
    ${repetir(hojas, i => `
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i}">
        <div class="flower__g-front__leaf"></div>
      </div>`)}
    <div class="flower__g-front__line"></div>
  </div>`);

const gFr = ({ delay, hojas }) => crecer(delay, `
  <div class="flower__g-fr">
    <div class="leaf"></div>
    ${repetir(hojas, i => `<div class="flower__g-fr__leaf flower__g-fr__leaf--${i}"></div>`)}
  </div>`);

const mataLarga = (retardos, n) => `
  <div class="long-g long-g--${n}">
    ${retardos.map((d, i) => crecer(d, `<div class="leaf leaf--${i}"></div>`)).join("")}
  </div>`;

/** Devuelve el HTML del jardín. Puro: no toca el DOM, así es testeable. */
export function construirJardin(cfg = jardin) {
  return [
    cfg.flores.map(flor).join(""),
    cfg.gLong.map(gLong).join(""),
    repetir(cfg.hierbaCreciente, hierba),
    cfg.gRight.map(gRight).join(""),
    gFront(cfg.gFront),
    gFr(cfg.gFr),
    cfg.longG.map(mataLarga).join(""),
  ].join("");
}

/** Pinta el jardín dentro del contenedor indicado. */
export function montarJardin(selector = ".flowers") {
  const destino = document.querySelector(selector);
  if (!destino) return null;
  destino.innerHTML = construirJardin();
  return destino;
}
