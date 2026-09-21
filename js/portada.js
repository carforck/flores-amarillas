/** Arranque de la portada. Todo el texto sale de config.js. */
import { portada } from "./config.js";
import { maquinaDeEscribir } from "./typewriter.js";
import { marcarIntencion } from "./audio.js";

document.title = portada.titulo;

maquinaDeEscribir(document.getElementById("typewriter"));

const desc = document.querySelector(".description");
if (desc) desc.innerHTML = portada.descripcion.map(l => `<span>${l}</span>`).join("<br>");

const btn = document.querySelector(".btn");
if (btn) {
  btn.textContent = portada.cta;
  // El click es el gesto del usuario que autoriza el sonido. Lo guardamos para
  // que la siguiente página pueda reproducir sin que el navegador lo bloquee.
  btn.addEventListener("click", marcarIntencion);
}
