/** Efecto máquina de escribir. Las frases vienen de config.js, no del código. */
import { portada } from "./config.js";

const VELOCIDAD = { escribir: 100, borrar: 50, pausa: 2000 };

export function maquinaDeEscribir(destino, frases = portada.frases, v = VELOCIDAD) {
  if (!destino || !frases.length) return () => {};

  // Si piden menos movimiento, mostramos la primera frase y punto.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    destino.textContent = frases[0];
    return () => {};
  }

  let frase = 0, letra = 0, borrando = false, timer = null;

  const paso = () => {
    const texto = frases[frase];
    letra += borrando ? -1 : 1;
    destino.textContent = texto.slice(0, letra);

    let espera = borrando ? v.borrar : v.escribir;
    if (!borrando && letra === texto.length) {
      borrando = true;
      espera = v.pausa;
    } else if (borrando && letra === 0) {
      borrando = false;
      frase = (frase + 1) % frases.length;
    }
    timer = setTimeout(paso, espera);
  };

  paso();
  return () => clearTimeout(timer);
}
