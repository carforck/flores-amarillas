/**
 * Motor de letra sincronizada.
 *
 * Arregla cuatro defectos del anim.js original:
 *  1. setInterval(1000) + Math.floor -> una línea podía entrar hasta 1s tarde.
 *     Ahora va con requestAnimationFrame contra audio.currentTime real.
 *  2. El fundido nunca fundía: (time - t) / 0.1 con `time` entero daba 0 o >=1.
 *     Ahora el fundido lo hace CSS con una clase.
 *  3. Duración fija de 6s para todas -> líneas solapadas o cortadas.
 *     Ahora cada línea declara su `dur` en config.js.
 *  4. Si el usuario rebobinaba, el estado no se recalculaba. Ahora es sin estado:
 *     la línea activa siempre se deriva del tiempo actual.
 */
import { letra } from "./config.js";

export function iniciarLetra(audio, destino, lineas = letra) {
  if (!audio || !destino) return () => {};

  const orden = [...lineas].sort((a, b) => a.t - b.t);
  let actual = null;
  let rafId = null;

  const lineaEn = t => {
    // Recorre al revés: gana la última que ya empezó y sigue viva.
    for (let i = orden.length - 1; i >= 0; i--) {
      const l = orden[i];
      if (t >= l.t && t < l.t + l.dur) return l;
    }
    return null;
  };

  const pintar = () => {
    const linea = lineaEn(audio.currentTime);
    if (linea !== actual) {
      actual = linea;
      // Palabra a palabra: el verso se posa en vez de aparecer de golpe.
      // Cada <span> lleva su índice y CSS le pone el retardo.
      destino.innerHTML = linea
        ? linea.text.split(" ").map((w, i) =>
            `<span style="--i:${i}">${w}</span>`).join(" ")
        : "";
      destino.classList.toggle("is-visible", Boolean(linea));
    }
    rafId = requestAnimationFrame(pintar);
  };

  pintar();

  // Devuelve la función de parada: sin fugas si la escena se desmonta.
  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };
}

/** Segundo en que termina la última línea: sirve para encadenar lo que venga. */
export const finDeLaLetra = (lineas = letra) =>
  lineas.reduce((max, l) => Math.max(max, l.t + l.dur), 0);
