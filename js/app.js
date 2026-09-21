/**
 * Arranque. Una sola página: portada -> stories -> cierre.
 *
 * Al ser una sola página, el toque de "empezar" es el gesto de usuario que
 * autoriza el sonido, así que la canción arranca siempre. El problema de
 * autoplay bloqueado que tenía el proyecto original desaparece por diseño.
 */
import { portada, cierre, fotos } from "./config.js";
import { audio as cfgAudio } from "./config.js";
import { montarJardin } from "./garden.js";
import { montarCampo, florecerCon } from "./campo.js";
import { maquinaDeEscribir } from "./typewriter.js";
import { iniciarLetra, finDeLaLetra } from "./lyrics.js";
import { repartir, montarStories, conectar, imagen } from "./stories.js";

const $ = s => document.querySelector(s);
const cuerpo = document.body;

// --- Jardín de fondo ------------------------------------------------------
montarJardin("#fondo .flowers");
const campo = montarCampo("#campo");
requestAnimationFrame(() => requestAnimationFrame(() =>
  cuerpo.classList.remove("container")));   // suelta las animaciones a la vez

// --- Portada --------------------------------------------------------------
document.title = portada.titulo;
const pararMaquina = maquinaDeEscribir($("#typewriter"));
$("#portada .descripcion").innerHTML = portada.descripcion.join("<br>");
$("#empezar").textContent = portada.cta;

// --- Stories --------------------------------------------------------------
const audio = $("audio");
const seccion = $("#stories");
const tramos = repartir();
montarStories(seccion, tramos);

const sinFotos = tramos.length === 0;
let mando = null;

function empezar() {
  audio.src = cfgAudio.src;
  audio.play().catch(() => {});          // dentro del gesto: el navegador lo permite

  $("#portada").classList.add("se-va");
  seccion.classList.add("esta-vivo");
  cuerpo.classList.remove("jardin-nitido");
  pararMaquina();

  iniciarLetra(audio, $("#verso"));

  // El fondo se va inundando de amarillo al ritmo de la canción.
  florecerCon(audio, campo, finDeLaLetra(), {
    alDesbordar: () => cuerpo.classList.add("desbordado"),
  });
  if (!sinFotos) mando = conectar(seccion, audio, tramos, { alTerminar: mostrarFinal });
}

$("#empezar").addEventListener("click", empezar, { once: true });

// --- Navegación: tocar los lados, mantener para pausar --------------------
let temporizador = null;
let pausadoPorMantener = false;

const soltar = () => {
  clearTimeout(temporizador);
  if (pausadoPorMantener) {
    audio.play().catch(() => {});
    cuerpo.classList.remove("en-pausa");
    pausadoPorMantener = false;
    return true;                          // era un "mantener", no un toque
  }
  return false;
};

seccion.querySelectorAll("[data-ir]").forEach(boton => {
  boton.addEventListener("pointerdown", () => {
    temporizador = setTimeout(() => {
      audio.pause();
      cuerpo.classList.add("en-pausa");
      pausadoPorMantener = true;
    }, 350);
  });
  boton.addEventListener("pointerup", () => {
    if (soltar()) return;
    if (!mando) return;
    boton.dataset.ir === "atras" ? mando.anterior() : mando.siguiente();
  });
  boton.addEventListener("pointercancel", soltar);
  boton.addEventListener("pointerleave", soltar);
});

// Teclado: flechas y espacio. Lo táctil no debe dejar fuera a quien no toca.
addEventListener("keydown", e => {
  if (!mando) return;
  if (e.key === "ArrowLeft") mando.anterior();
  if (e.key === "ArrowRight") mando.siguiente();
  if (e.key === " ") {
    e.preventDefault();
    audio.paused ? audio.play() : audio.pause();
    cuerpo.classList.toggle("en-pausa", !audio.paused ? false : true);
  }
});

// --- Cierre ---------------------------------------------------------------
function mostrarFinal() {
  const final = $("#final");
  final.querySelector("h2").textContent = cierre.titulo;
  final.querySelector(".cierre").innerHTML = cierre.texto.join("<br>");
  // En la rejilla se piden de inmediato: aquí ya no hay nada que diferir.
  final.querySelector(".rejilla").innerHTML =
    fotos.map(f => imagen(f, { prioridad: true })).join("");
  final.classList.add("esta-vivo");
  cuerpo.classList.add("ha-terminado");
  cuerpo.classList.add("jardin-nitido");   // el jardín se revela nítido al final
}

$("#otra-vez").addEventListener("click", () => location.reload());
