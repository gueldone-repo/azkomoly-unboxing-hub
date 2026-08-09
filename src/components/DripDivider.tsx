import { useId } from "react";

// Path de gotas pesadas y redondas, calculado con curvas Bézier.
// Fuente: molde de referencia del cliente, reutilizado vía <defs>/<use>.
const HEAVY_DRIP_PATH =
  "M0,0 L1200,0 L1200,15 " +
  "C 1180,15 1180,60 1170,80 C 1160,100 1140,100 1130,80 C 1120,60 1120,15 1090,15 " +
  "C 1070,15 1070,120 1060,140 C 1050,160 1030,160 1020,140 C 1010,120 1010,15 980,15 " +
  "C 960,15 960,40 950,50 C 940,60 920,60 910,50 C 900,40 900,15 870,15 " +
  "C 850,15 850,90 840,110 C 830,130 810,130 800,110 C 790,90 790,15 760,15 " +
  "C 740,15 740,140 730,160 C 720,180 700,180 690,160 C 680,140 680,15 650,15 " +
  "C 630,15 630,60 620,70 C 610,80 590,80 580,70 C 570,60 570,15 540,15 " +
  "C 520,15 520,110 510,130 C 500,150 480,150 470,130 C 460,110 460,15 430,15 " +
  "C 410,15 410,40 400,50 C 390,60 370,60 360,50 C 350,40 350,15 320,15 " +
  "C 300,15 300,130 290,150 C 280,170 260,170 250,150 C 240,130 240,15 210,15 " +
  "C 190,15 190,80 180,100 C 170,120 150,120 140,100 C 130,80 130,15 100,15 " +
  "C 80,15 80,50 70,70 C 60,90 40,90 30,70 C 20,50 20,15 0,15 Z";

// Ondas suaves y parejas (repiten cada 100 unidades) — versión discreta del
// derretido, pensada para bordes chicos como el navbar. Sin tramo recto: la
// curva arranca directo desde el borde superior (y=0), así no se suma una
// franja plana al borde ya recto del contenedor que la usa.
const SOFT_WAVE_PATH =
  "M1200,0 " +
  "C1150,0 1150,20 1100,20 C1050,20 1050,0 1000,0 " +
  "C950,0 950,20 900,20 C850,20 850,0 800,0 " +
  "C750,0 750,20 700,20 C650,20 650,0 600,0 " +
  "C550,0 550,20 500,20 C450,20 450,0 400,0 " +
  "C350,0 350,20 300,20 C250,20 250,0 200,0 " +
  "C150,0 150,20 100,20 C50,20 50,0 0,0 Z";

// Borde orgánico: amplitudes y anchos irregulares (no se repite cada X
// unidades como las olas), silueta más "líquida" y menos mecánica. También
// sin tramo recto inicial — la curva nace del borde superior.
const ORGANIC_PATH =
  "M1200,0 " +
  "C1150,0 1135,18 1095,15 C1055,12 1045,0 1000,4 " +
  "C960,7 955,24 905,20 C860,16 850,0 800,3 " +
  "C750,8 745,26 695,21 C650,17 645,1 595,6 " +
  "C550,10 548,22 500,18 C455,14 450,0 400,5 " +
  "C355,10 350,24 300,19 C255,15 250,0 200,6 " +
  "C155,11 150,23 100,18 C60,14 45,2 0,5 " +
  "L0,0 Z";

const VARIANTS = {
  drip: { path: HEAVY_DRIP_PATH, viewBoxHeight: 180 },
  wave: { path: SOFT_WAVE_PATH, viewBoxHeight: 20 },
  organic: { path: ORGANIC_PATH, viewBoxHeight: 26 },
} as const;

export function DripDivider({
  mainColor,
  bgColor,
  shadowColor = "#0D0D0D",
  height = 120,
  opacity = 1,
  flip = false,
  variant = "drip",
  /** Cuántos escalones de 1px arma el relieve 3D (más = más profundo/tallado). */
  depth = 1,
  className = "",
}: {
  /** Color de la capa principal (el color de la sección/franja que "gotea"). */
  mainColor: string;
  /** Fondo sólido del contenedor — el color de la sección hacia la que cae el derretido. Por defecto transparente. */
  bgColor?: string;
  /** Color del relieve/canto 3D detrás del color principal. */
  shadowColor?: string;
  height?: number;
  opacity?: number;
  /** true = el derretido cuelga hacia arriba en vez de hacia abajo. */
  flip?: boolean;
  /** "drip" = gotas pesadas y redondas. "wave" = ondas parejas y discretas. "organic" = silueta irregular, más líquida. */
  variant?: keyof typeof VARIANTS;
  depth?: number;
  className?: string;
}) {
  const rawId = useId();
  const pathId = `drip-${rawId.replace(/[:]/g, "")}`;
  const { path, viewBoxHeight } = VARIANTS[variant];
  const layers = Math.max(1, depth);
  const steps = Array.from({ length: layers }, (_, i) => i + 1);

  // El relieve 3D son copias del path corridas hacia abajo (translate y = s*1.4).
  // La copia más profunda cae por debajo del viewBox original, y el SVG recorta
  // ahí: eso dibujaba una LÍNEA RECTA negra a lo ancho, justo donde los valles
  // tocaban el borde. Se le da al viewBox exactamente ese aire de más y se
  // agranda el SVG en la misma proporción, así la onda se ve idéntica (misma
  // escala vertical) pero ya sin recorte. El sobrante cuelga fuera del alto del
  // contenedor — es el canto derretido cayendo sobre la sección de abajo, que es
  // justo lo que se quiere ver.
  const overhang = layers * 1.4;
  const svgViewBoxHeight = viewBoxHeight + overhang;
  const svgHeight = height * (svgViewBoxHeight / viewBoxHeight);

  return (
    <div
      aria-hidden="true"
      className={`relative w-full pointer-events-none select-none ${className}`}
      style={{ height, opacity, backgroundColor: bgColor, transform: flip ? "scaleY(-1)" : undefined }}
    >
      {/* Sin overflow-hidden a propósito: recortaba tanto el relieve como el
          drop-shadow en seco, dejando otra línea recta. Lo que sobresale es
          transparente salvo la silueta del derretido.

          El -1px de arriba tampoco es capricho: el borde recto del relleno y el
          fondo del contenedor caían en la misma fila de píxeles (y suelen caer en
          una fracción, tipo 463.2), así que el antialiasing los mezclaba y pintaba
          una línea gris de 1px a lo ancho. Subiéndolo, ese borde queda sobre la
          sección de arriba — que es del mismo color que el derretido — y la mezcla
          se vuelve invisible. */}
      <svg
        viewBox={`0 0 1200 ${svgViewBoxHeight}`}
        preserveAspectRatio="none"
        className="absolute left-0 w-full"
        style={{ top: -1, height: svgHeight + 1, filter: "drop-shadow(0 6px 5px rgba(0,0,0,0.2))" }}
      >
        <defs>
          <path id={pathId} d={path} />
        </defs>
        {steps.map((s) => (
          <use key={s} href={`#${pathId}`} fill={shadowColor} transform={`translate(${s}, ${s * 1.4})`} />
        ))}
        <use href={`#${pathId}`} fill={mainColor} />
      </svg>
    </div>
  );
}
