/**
 * Onda de fondo del hero — es la conexión entre el hero (blanco) y la sección
 * morada de productos.
 *
 * El path viene de `public/wave-haikei.svg`, pero se dibuja inline en vez de
 * usar el archivo por dos razones:
 *  - el archivo trae el morado `#63126f`, que NO es el de la marca (`#5B2EA8`),
 *    y además un `<rect>` de fondo `#f5fafc` que aquí sobra;
 *  - inline se puede estirar con `preserveAspectRatio="none"` para que cubra
 *    cualquier ancho sin bandas ni costuras, y pintarlo con el token de color.
 *
 * Va absolutamente al fondo (`z-0`) y anclado abajo: el hero apoya sobre la
 * onda y la sección siguiente continúa el mismo morado, así que no hay corte
 * visible entre ambas.
 */
export function WaveBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden">
      <svg
        viewBox="0 0 900 600"
        preserveAspectRatio="none"
        className="block h-[46vh] w-full sm:h-[52vh] lg:h-[58vh]"
      >
        <path
          d="M0 339L30 353C60 367 120 395 180 397.7C240 400.3 300 377.7 360 376.2C420 374.7 480 394.3 540 406.7C600 419 660 424 720 423.8C780 423.7 840 418.3 870 415.7L900 413L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
          fill="var(--fire)"
        />
      </svg>
    </div>
  );
}
