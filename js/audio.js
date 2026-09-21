/**
 * Reproducción respetando la política de autoplay.
 *
 * El original usaba <audio autoplay> sin más: Chrome, Safari y Firefox lo
 * bloquean si no hubo un gesto del usuario, y como de index.html a flower.html
 * hay una navegación completa, el gesto del botón no viajaba. Resultado: en la
 * mayoría de los móviles la canción nunca sonaba.
 *
 * Aquí guardamos la intención al pulsar el botón y, si aun así el navegador
 * rechaza el play, mostramos un botón para tocar. Nunca se queda en silencio
 * sin avisar.
 */
const CLAVE = "flores:reproducir";

/** Se llama desde la portada, dentro del click: marca que hubo gesto. */
export function marcarIntencion() {
  try { sessionStorage.setItem(CLAVE, "1"); } catch { /* modo privado */ }
}

function consumirIntencion() {
  try {
    const v = sessionStorage.getItem(CLAVE) === "1";
    sessionStorage.removeItem(CLAVE);
    return v;
  } catch { return false; }
}

/**
 * Intenta reproducir. Si el navegador lo bloquea, llama a `alBloquear` para que
 * la interfaz ofrezca un botón; un toque en cualquier sitio también reintenta.
 */
export async function reproducir(audio, { alBloquear } = {}) {
  if (!audio) return false;
  audio.preload = "auto";
  const habiaGesto = consumirIntencion();

  try {
    await audio.play();
    return true;
  } catch {
    // Bloqueado. Reintentamos al primer gesto real que ocurra en la página.
    const reintentar = async () => {
      try {
        await audio.play();
        quitar();
        alBloquear?.(false);
      } catch { /* sigue bloqueado, seguimos esperando */ }
    };
    const eventos = ["pointerdown", "keydown", "touchstart"];
    const quitar = () => eventos.forEach(e => document.removeEventListener(e, reintentar));
    eventos.forEach(e => document.addEventListener(e, reintentar, { passive: true }));

    alBloquear?.(true, { habiaGesto });
    return false;
  }
}
