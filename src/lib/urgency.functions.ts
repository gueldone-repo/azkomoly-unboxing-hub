import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

// Countdown de urgencia: 5 minutos por IP, no por sesión de navegador —
// pedido explícito de Diego (antes vivía en sessionStorage, así que
// refrescar en otra pestaña o limpiar el storage lo reiniciaba gratis).
// Vive en memoria del proceso: se resetea si el servidor reinicia/redeploya,
// aceptable por ahora dado el volumen del sitio.
//
// PENDIENTE: el reloj es solo decorativo — cuenta 5 minutos pero no aplica
// ningún descuento real. Decisión de Diego (2026-08-19): así sale el lunes,
// se conecta en otra sesión cuando exista un código de descuento real en
// Shopify (Admin → Discounts). Ese día, lo que falta es: leer ese código acá
// (igual que ya se lee para BoxSpinner) y pegarlo al link de compra mientras
// el reloj no haya llegado a 0.
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
