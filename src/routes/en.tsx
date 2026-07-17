import { createFileRoute, Outlet } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";

/**
 * Layout de las rutas en inglés.
 *
 * Existe por SEO: hasta ahora el idioma vivía solo en una cookie, así que para
 * Google el contenido en inglés no existía — no había ninguna URL que indexar.
 * `/en/*` le da al inglés URLs propias, emparejadas con las húngaras vía
 * hreflang (ver src/lib/seo.ts).
 *
 * `forceLang="en"` ignora la cookie: un crawler llega sin cookie y aun así ve
 * inglés acá, y húngaro en `/`. Este provider anida dentro del de __root, y el
 * de adentro gana para sus hijos — por eso `/` sigue funcionando igual que
 * siempre y ningún usuario actual nota el cambio.
 */
export const Route = createFileRoute("/en")({
  component: EnLayout,
});

function EnLayout() {
  return (
    <I18nProvider forceLang="en">
      <Outlet />
    </I18nProvider>
  );
}
