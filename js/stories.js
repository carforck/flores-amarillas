/**
 * Motor de Stories.
 *
 * Cada foto ocupa un tramo de la canción. Las barras de progreso se alimentan
 * de audio.currentTime, así que nunca mienten: si la canción se atasca, la
 * barra se atasca con ella.
 *
 * El reparto de fotos en la canción es automático y se adapta a cuántas haya:
 * con 3 fotos salen 3 tramos largos, con 13 salen 13 cortos. Sin tocar código.
 */
import { fotos as FOTOS, letra, instagram } from "./config.js";
import { finDeLaLetra } from "./lyrics.js";

const RAIZ = "photos/opt";

/** Reparte las fotos a lo largo de la letra, cuadrando con el inicio de un verso. */
export function repartir(fotos = FOTOS, lineas = letra) {
  if (!fotos.length || !lineas.length) return [];
  const orden = [...lineas].sort((a, b) => a.t - b.t);
  const inicio = orden[0].t;
  const fin = finDeLaLetra(orden);

  // Corte ideal por tiempo, ajustado al verso más cercano para no partirlo.
  // Los cortes deben ser estrictamente crecientes y no repetir verso: si no,
  // dos fotos caerían en el mismo instante y una duraría 0 segundos.
  const versos = orden.map(l => l.t);

  // Si hay más fotos que versos no se puede cuadrar con ninguno: reparto liso.
  if (fotos.length > versos.length) {
    const paso = (fin - inicio) / fotos.length;
    const lisos = fotos.map((_, i) => inicio + paso * i);
    return fotos.map((foto, i) => ({
      ...foto,
      inicio: foto.t ?? lisos[i],
      fin: foto.t ?? (lisos[i + 1] ?? fin),
    }));
  }

  const cortes = [inicio];
  let desde = 1;                                   // primer verso aún libre
  for (let i = 1; i < fotos.length; i++) {
    const ideal = inicio + ((fin - inicio) * i) / fotos.length;
    const restantes = fotos.length - i - 1;        // cortes que faltan tras este
    const tope = versos.length - 1 - restantes;    // hay que dejarles sitio
    let mejor = desde;
    for (let k = desde; k <= tope; k++) {
      if (Math.abs(versos[k] - ideal) < Math.abs(versos[mejor] - ideal)) mejor = k;
    }
    cortes.push(versos[mejor]);
    desde = mejor + 1;
  }

  return fotos.map((foto, i) => ({
    ...foto,
    inicio: foto.t ?? cortes[i],
    fin: foto.t ?? (cortes[i + 1] ?? fin),
  }));
}

/**
 * Los anchos salen de la propia foto, no de una lista fija.
 *
 * Estaban clavados a [480, 900, 1400], pero el generador no crea un tamaño
 * mayor que el original: una foto de 1085px sólo tiene 480 y 900. El srcset
 * anunciaba igualmente el 1400 y en un móvil de pantalla densa el navegador
 * pedía un archivo que no existe.
 */
const srcset = (foto, ext) =>
  foto.anchos.map(a => `${RAIZ}/${foto.nombre}-${a}.${ext} ${a}w`).join(", ");

/** El mayor que existe de verdad: sirve de reserva para el <img src>. */
const reserva = foto => `${RAIZ}/${foto.nombre}-${foto.anchos.at(-1)}.jpg`;

/*
 * Lo que mide la foto de verdad, para que el navegador no se baje de más.
 *
 * Decía «440px en escritorio, 100vw en móvil», que era de cuando la foto
 * ocupaba la pantalla entera. Ahora vive en una tarjeta topada a 19rem
 * (304px) con un 7% de aire a cada lado: 86vw hasta que ese tope entra, a
 * partir de 354px de ancho.
 */
const TAM = "(min-width: 354px) 304px, 86vw";

/**
 * <picture> con AVIF -> WebP -> JPEG y miniatura borrosa mientras carga.
 *
 * Las stories están todas dentro del viewport (superpuestas), así que
 * loading="lazy" no difiere nada: el navegador se bajaría las tres a la vez.
 * Por eso las que no son la primera nacen sin `srcset` y se hidratan cuando
 * les toca el turno (y una por delante, para que nunca se vea el hueco).
 */
export function imagen(foto, { prioridad = false } = {}) {
  const attr = prioridad
    ? { av: "srcset", we: "srcset", im: "srcset", src: `src="${reserva(foto)}"` }
    : { av: "data-srcset", we: "data-srcset", im: "data-srcset", src: "" };

  return `
    <picture class="post__media" style="--lqip: url('${foto.lqip}'); --ratio: ${foto.ratio}">
      <source type="image/avif" ${attr.av}="${srcset(foto, "avif")}" sizes="${TAM}">
      <source type="image/webp" ${attr.we}="${srcset(foto, "webp")}" sizes="${TAM}">
      <img ${attr.src} ${attr.im}="${srcset(foto, "jpg")}" sizes="${TAM}"
           data-jpg="${reserva(foto)}"
           alt="${foto.alt}" decoding="async"
           fetchpriority="${prioridad ? "high" : "auto"}">
    </picture>`;
}

/** Pasa data-srcset a srcset: a partir de aquí el navegador se la baja. */
export function hidratar(post) {
  if (!post || post.dataset.lista) return;
  post.dataset.lista = "1";
  post.querySelectorAll("[data-srcset]").forEach(n => {
    n.setAttribute("srcset", n.dataset.srcset);
    n.removeAttribute("data-srcset");
    if (n.tagName === "IMG" && !n.getAttribute("src")) n.setAttribute("src", n.dataset.jpg);
  });
}

/**
 * La foto va en una tarjeta que flota sobre el jardín, no a pantalla completa.
 * A pantalla completa tapaba el fondo, el campo de flores y el vídeo, que son
 * justo lo que hace bonita la escena.
 */
const tarjeta = (foto, i) => `
  <article class="post" data-story="${i}" aria-hidden="${i === 0 ? "false" : "true"}">
    <div class="post__card">
      <header class="post__head">
        <span class="post__avatar" aria-hidden="true"></span>
        <span class="post__user">${instagram.usuario}</span>
        <span class="post__dot" aria-hidden="true">·</span>
        <span class="post__time">${instagram.pie}</span>
      </header>
      ${imagen(foto, { prioridad: i === 0 })}
      <footer class="post__foot">
        <p class="post__caption"><b>${instagram.usuario}</b> ${foto.caption}</p>
      </footer>
    </div>
  </article>`;

export function montarStories(raiz, tramos) {
  raiz.querySelector(".stories__bars").innerHTML =
    tramos.map((_, i) => `<span class="bar" data-bar="${i}"><i></i></span>`).join("");
  raiz.querySelector(".stories__deck").innerHTML = tramos.map(tarjeta).join("");
}

/**
 * Conecta el motor al audio. Devuelve utilidades para los controles.
 */
export function conectar(raiz, audio, tramos, { alTerminar } = {}) {
  const barras = [...raiz.querySelectorAll("[data-bar] i")];
  const posts = [...raiz.querySelectorAll("[data-story]")];
  const cinta = raiz.querySelector(".stories__deck");
  let activo = -1;
  let terminado = false;

  const indiceEn = t => {
    for (let i = tramos.length - 1; i >= 0; i--) if (t >= tramos[i].inicio) return i;
    return 0;
  };

  const pintar = () => {
    const t = audio.currentTime;
    const i = indiceEn(t);

    if (i !== activo) {
      hidratar(posts[i]);
      hidratar(posts[i + 1]);          // una por delante: nunca se ve el hueco
      posts.forEach((p, n) => {
        p.classList.toggle("is-active", n === i);
        p.setAttribute("aria-hidden", String(n !== i));
      });
      cinta.style.translate = `${-i * 100}% 0`;
      // Efecto ruleta: las tarjetas de los lados se giran y se van al fondo.
      // El giro se limita a 2 posiciones para que con muchas fotos las lejanas
      // no queden de canto y desaparezcan.
      posts.forEach((p, n) => {
        const d = Math.max(-2, Math.min(2, n - i));
        const lejos = Math.abs(d);
        p.style.transform =
          `perspective(1100px) rotateY(${-d * 34}deg) ` +
          `translateZ(${-lejos * 120}px) scale(${1 - lejos * 0.08})`;
      });
      activo = i;
    }

    tramos.forEach((tramo, n) => {
      const p = n < i ? 1 : n > i ? 0
        : Math.min(1, Math.max(0, (t - tramo.inicio) / (tramo.fin - tramo.inicio)));
      barras[n].style.transform = `scaleX(${p})`;
    });

    if (!terminado && t >= tramos.at(-1).fin) {
      terminado = true;
      alTerminar?.();
    }
    requestAnimationFrame(pintar);
  };
  pintar();

  const irA = i => {
    const n = Math.min(tramos.length - 1, Math.max(0, i));
    audio.currentTime = tramos[n].inicio;
  };

  return {
    siguiente: () => irA(indiceEn(audio.currentTime) + 1),
    anterior: () => irA(indiceEn(audio.currentTime) - 1),
    indice: () => indiceEn(audio.currentTime),
  };
}
