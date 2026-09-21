/** Arranque de la escena: jardín + canción + letra. */
import { audio as cfgAudio, portada } from "./config.js";
import { montarJardin } from "./garden.js";
import { iniciarLetra } from "./lyrics.js";
import { reproducir } from "./audio.js";

const cuerpo = document.body;

// 1. El jardín se genera desde datos, no desde HTML escrito a mano.
montarJardin(".flowers");

// 2. Las animaciones arrancan a la vez, cuando la escena ya está pintada.
//    (.container las mantiene en pausa; lo quitamos en el siguiente frame.)
requestAnimationFrame(() => requestAnimationFrame(() => {
  cuerpo.classList.remove("container");
}));

// 3. Canción y letra.
const el = document.querySelector("audio");
const lyrics = document.getElementById("lyrics");
const boton = document.getElementById("play-gate");

if (el) {
  el.src = cfgAudio.src;
  reproducir(el, {
    alBloquear: (bloqueado) => boton?.classList.toggle("is-visible", bloqueado),
  });
  boton?.addEventListener("click", () => el.play().catch(() => {}));
}

iniciarLetra(el, lyrics);

document.title = portada.titulo;
