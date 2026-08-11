import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

// Countdown de urgencia: 5 minutos por IP, no por sesión de navegador —
// pedido explícito de Diego (antes vivía en sessionStorage, así que
// refrescar en otra pestaña o limpiar el storage lo reiniciaba gratis).
// Vive en memoria del proceso: se resetea si el servidor reinicia/redeploya,
// aceptable por ahora dado el volumen del sitio.
const DURATION_SECONDS = 5 * 60;
const deadlinesByIp = new Map<string, number>();

export const getUrgencyDeadline = createServerFn({ method: "GET" }).handler(async () => {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  const now = Date.now();
  const existing = deadlinesByIp.get(ip);
  if (existing && existing > now) {
    return { deadline: existing };
  }
  const deadline = now + DURATION_SECONDS * 1000;
  deadlinesByIp.set(ip, deadline);
  return { deadline };
});
