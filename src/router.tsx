import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,

    // Abrir un producto se sentía lento porque su `loader` pide la ficha a
    // Shopify y el router no navega hasta que responde: el click parecía
    // congelado. Con "intent" la carga empieza en cuanto el usuario muestra
    // intención (cursor encima o dedo apoyado), así que al soltar el click los
    // datos suelen estar listos y la navegación es inmediata.
    defaultPreload: "intent",

    // Antes estaba en 0, lo que tiraba el resultado precargado y obligaba a
    // pedirlo otra vez al hacer click: se pagaba la espera igualmente. 30s es
    // margen de sobra para el salto entre ver la caja y abrirla, y la ficha se
    // revalida igual al montar.
    defaultPreloadStaleTime: 30_000,

    // Si aun así hay que esperar, que se vea que algo pasa en vez de dejar la
    // pantalla muerta; el mínimo evita el parpadeo cuando responde rápido.
    defaultPendingMs: 150,
    defaultPendingMinMs: 300,
  });

  return router;
};
