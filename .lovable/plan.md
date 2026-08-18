# Arreglos mobile/tablet + textos

## 1. Ventana de suscripción torcida (móvil/tablet)
El diálogo usa el borde "graffiti" (una sombra desplazada en diagonal), que lo hace ver descentrado en pantallas chicas. Se quita ese borde desplazado en móvil/tablet (se mantiene en desktop), se centra el panel y se ajusta el ancho para que quede simétrico con márgenes iguales.

## 2. Sticker del chico sentado tapando el precio
El sticker de la sección morada se achica y se reubica en tablet y móvil (más arriba y más al borde, sin invadir la primera tarjeta). En desktop queda exactamente como está hoy.

## 3. FAQ y About vuelven a húngaro en modo inglés
Hoy `/about` tiene todo el texto escrito directamente en húngaro dentro del archivo, y ni `/about` ni `/faq` tienen versión inglesa. Se mueve ese contenido al diccionario (hu + en) y se crean las rutas gemelas `/en/about` y `/en/faq`, con los enlaces del menú y del footer apuntando a la versión del idioma activo.

## 4. Orden de los productos y la palabra "AZKOMOLY"
- Los títulos vienen de Shopify. La cuenta de Shopify está desconectada (el token caducó), así que hace falta reconectarla para tocar traducciones allá — eso queda para después, como pediste.
- Mientras tanto, del lado del sitio: se fija el orden de las cajas (las dos maletas siempre al final) y se protege la marca — si el título traducido llega como "SERIOUS ..." se muestra "AZKOMOLY ...". La palabra AZKOMOLY nunca se traduce, en ningún idioma.

## 5. Título principal en línea recta
El titular del hero hoy va sobre una curva. Pasa a ser una línea recta en movimiento (mismo texto, misma velocidad y mismo comportamiento en móvil).

## 6. Paso 4 de "Cómo funciona": el 20%
Se agrega una frase corta (hu + en), algo como: "Grábalo, publícalo y etiquétanos: te mandamos un 20% para tu próxima compra." Texto final ajustable.

## 7. Tipografías moradas con sombra negra
Se quita el efecto 3D negro de los títulos morados (About, FAQ, Blog, página de producto). Los títulos quedan morado plano sobre blanco y blanco plano sobre morado, que se leen mucho mejor.

## 8. Sección "Reviews" con videos de unboxing
Se elimina el bloque de videos de la página About y el enlace "Vélemények / Reviews" del menú pasa a llevar a la home, a la sección que ya tiene esos mismos videos.

## 9. Fin del flash deal
Cuando el contador llega a cero, en vez de "00:00" muestra "Villámajánlat lejárt" / "Flash offer ended" (se agrega la clave en ambos idiomas).

## Notas técnicas
- Copys nuevos en `src/lib/i18n/dictionary.ts` (hu + en) y en el tipo `Dict`.
- Rutas nuevas `src/routes/en.about.tsx` y `src/routes/en.faq.tsx`; `about`/`faq` pasan a `seoLinks(path, lang)` en lugar de `seoLinksHuOnly`.
- Orden y normalización de títulos en la capa de productos (`ProductsSection` / `client.ts`), sin tocar el checkout ni el carrito.
- Título del hero: reemplazo de `CurvedLoop` por marquesina recta en `HeroV2.tsx`.
- `text-3d-fire` deja de aplicarse en las páginas listadas; la utilidad se conserva en `styles.css`.
- Sin cambios de backend ni de esquema.
