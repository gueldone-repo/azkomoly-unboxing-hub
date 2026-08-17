import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useSignupDialogStore } from "@/lib/state/signup-dialog-store";

const DISMISSED_KEY = "azkomoly-discount-widget-dismissed";

/**
 * Widget de captación en la esquina inferior. Ofrece un descuento a cambio de
 * los datos y, al pulsar, abre el SignupDialog que YA existe en la landing
 * (nombre / email / teléfono opcional + consentimiento, guardando en Supabase
 * `azkomoly_leads` y espejando al Google Sheet). No duplica el formulario:
 * este componente es sólo el anzuelo.
 *
 * No aparece de golpe: espera a que el usuario haya scrolleado un poco, para
 * no competir con el cookie banner ni interrumpir el hero. Una vez cerrado,
 * no vuelve a molestar (localStorage).
 */
export function DiscountWidget() {
  const t = useT();
  const setSignupOpen = useSignupDialogStore((s) => s.setOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch {
      // localStorage bloqueado (modo privado, cookies off): mostrar igual.
    }

    // Dos disparadores, gana el primero:
    //   - el usuario scrollea (centinela + IntersectionObserver, en vez de un
    //     listener de scroll que correría en cada frame)
    //   - o pasan unos segundos sin que scrollee
    // Hace falta el temporizador porque un salto de scroll instantáneo (un
    // ancla, la tecla End) puede pasar de largo el centinela sin que el
    // observer llegue a registrar el cruce, y entonces el widget no salía.
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setVisible(true);
    };

    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:80vh;height:1px;width:1px;pointer-events:none";
    document.body.appendChild(sentinel);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show();
      },
      { threshold: 0 }
    );
    io.observe(sentinel);

    // Ya venía scrolleado (recarga a media página): mostrar sin esperar.
    if (window.scrollY > window.innerHeight * 0.8) show();

    const timer = window.setTimeout(show, 6000);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Si no se puede persistir, se cierra igual en esta sesión.
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[min(88vw,310px)] animate-fade-up">
      <div className="relative rounded-2xl bg-white border-2 border-fire/25 shadow-[0_18px_45px_rgba(91,46,168,0.28)] pt-3 pr-3 pb-4 pl-4">
        <button
          onClick={dismiss}
          aria-label={t.discountWidget.close}
          className="absolute top-2 right-2 grid place-items-center h-7 w-7 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {/* WebP de 520px: el PNG original eran 706 KB para enseñarse a
              104px de ancho. Ahora son 18 KB. */}
          <img
            src="/asset_azkomoly.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
            width={520}
            height={290}
            className="w-[104px] shrink-0 -ml-3 -my-2"
          />
          <div className="min-w-0">
            <p
              className="text-fire leading-[0.95] text-[15px] pr-5"
              style={{ fontFamily: "'Anton', var(--font-display)" }}
            >
              {t.discountWidget.title}
            </p>
            <p className="font-sans text-[12px] leading-snug text-foreground/60 mt-1.5">
              {t.discountWidget.sub}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSignupOpen(true)}
          className="btn-3d mt-3 w-full bg-fire px-4 py-2.5 font-sans text-sm font-semibold tracking-wide text-white"
        >
          {t.discountWidget.cta}
        </button>
      </div>
    </div>
  );
}
