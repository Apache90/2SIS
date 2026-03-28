═══════════════════════════════════════════════════════════
  2SIS · Dosis Pediátrica — Guía de deploy PWA
  Apache90 · v1.0 · 2026
═══════════════════════════════════════════════════════════

ARCHIVOS INCLUIDOS EN ESTE PAQUETE
───────────────────────────────────
  2SIS.html       → La app completa (HTML + CSS + JS)
  manifest.json   → Configuración PWA (nombre, ícono, colores)
  sw.js           → Service worker (cache offline)
  README.txt      → Este archivo
  icons/          → CARPETA QUE DEBÉS CREAR con los íconos (ver paso 1)


PASO 1 — CREAR LOS ÍCONOS (10 minutos)
───────────────────────────────────────
1. Ir a: https://realfavicongenerator.net
2. Subir una imagen PNG cuadrada con el logo de 2SIS
   (mínimo 512×512 px, fondo #0f0f13 o transparente)
3. En "Favicon Generator Options":
   - Seleccionar color de tema: #7c6cff
   - Background iOS: #0f0f13
4. Hacer clic en "Generate your Favicons and HTML code"
5. Descargar el paquete ZIP
6. Del ZIP, extraer solo los archivos PNG y renombrarlos:
   
   android-chrome-192x192.png  →  icons/icon-192.png
   android-chrome-512x512.png  →  icons/icon-512.png
   apple-touch-icon.png        →  icons/icon-180.png
   
   Para los tamaños restantes, podés usar este servicio online
   para redimensionar icon-512.png:
   https://www.iloveimg.com/resize-image
   
   Tamaños necesarios:
   icons/icon-72.png   (72×72)
   icons/icon-96.png   (96×96)
   icons/icon-128.png  (128×128)
   icons/icon-144.png  (144×144)
   icons/icon-152.png  (152×152)
   icons/icon-180.png  (180×180)  ← iOS touch icon
   icons/icon-192.png  (192×192)  ← Android
   icons/icon-512.png  (512×512)  ← Splash + Play Store futuro

   ATAJO: Si solo querés funcionalidad básica rápida,
   alcanza con tener icon-192.png e icon-512.png.
   Los otros tamaños son para compatibilidad máxima.


PASO 2 — ESTRUCTURA FINAL DE ARCHIVOS
──────────────────────────────────────
Antes de subir, verificar que la carpeta tenga esta estructura:

  2sis-pwa/
  ├── 2SIS.html
  ├── manifest.json
  ├── sw.js
  └── icons/
      ├── icon-72.png
      ├── icon-96.png
      ├── icon-128.png
      ├── icon-144.png
      ├── icon-152.png
      ├── icon-180.png
      ├── icon-192.png
      └── icon-512.png


PASO 3 — DEPLOY EN NETLIFY (5 minutos, GRATIS)
────────────────────────────────────────────────
1. Ir a: https://netlify.com
2. Crear cuenta gratuita (con Google o email)
3. En el dashboard, hacer clic en "Add new site" → "Deploy manually"
4. ARRASTRAR la carpeta "2sis-pwa/" completa al área de drop
5. Netlify genera automáticamente una URL como:
   https://amazing-llama-123456.netlify.app
6. ¡Listo! La PWA ya está online con HTTPS automático.

   URL a entregar a compradores en Gumroad:
   https://TU-SITIO.netlify.app/2SIS.html


PASO 4 — DOMINIO PERSONALIZADO (opcional, ~$12 USD/año)
─────────────────────────────────────────────────────────
1. Comprar dominio en Namecheap.com o NIC.ar:
   Opciones recomendadas:
   - 2sis.app        (~$12/año en Google Domains)
   - app.2sis.com    (si comprás 2sis.com en Namecheap)
   - 2sis.netlify.app (GRATIS, subdominio de Netlify)
   
2. En Netlify: Site Settings → Domain Management → Add custom domain
3. Seguir los pasos para apuntar los DNS de Namecheap a Netlify
4. Netlify agrega HTTPS automático (Let's Encrypt, gratis)

   Tiempo de propagación DNS: 5 minutos – 48 horas


PASO 5 — ACTUALIZAR LA APP EN EL FUTURO
─────────────────────────────────────────
Cuando quieras subir una nueva versión (más fármacos, fixes, etc.):

1. Editar el archivo 2SIS.html con los cambios
2. IMPORTANTE: En sw.js, cambiar la versión del cache:
   const CACHE_VERSION = '2sis-v1.0';
   →
   const CACHE_VERSION = '2sis-v1.1';  ← incrementar número
   
   Esto fuerza que todos los usuarios descarguen la versión nueva.
   
3. En Netlify: arrastrar la carpeta actualizada al dashboard
   (o usar Netlify CLI para actualizaciones desde terminal)
4. Netlify publica instantáneamente. Los usuarios verán el toast
   "Actualización disponible — recargá para aplicar" la próxima
   vez que abran la app con conexión.


PASO 6 — VERIFICAR QUE LA PWA FUNCIONA CORRECTAMENTE
──────────────────────────────────────────────────────
1. Abrir Chrome en Android y navegar a la URL
2. Abrir Chrome DevTools → pestaña "Application"
3. Verificar:
   ✓ Manifest: todos los campos en verde
   ✓ Service Workers: Status "activated and running"
   ✓ Storage → Cache Storage: "2sis-cache-v1.0" con los archivos
   
4. En Chrome mobile: después de 30 segundos, aparece el banner
   "Instalar 2SIS" en la parte inferior de la pantalla
   
5. Audit Lighthouse (DevTools → Lighthouse → PWA):
   Debería obtener puntuación PWA ≥ 90/100


PASO 7 — OFUSCACIÓN (antes de cada deploy a producción)
─────────────────────────────────────────────────────────
Para proteger el código fuente:

1. Ir a: https://obfuscator.io
2. Pegar el bloque <script> del 2SIS.html
3. Configuración recomendada:
   - Compact: ON
   - Self Defending: ON
   - String Array: ON
   - String Array Encoding: base64
   - Control Flow Flattening: ON (50%)
   - Dead Code Injection: OFF (aumenta demasiado el tamaño)
4. Hacer clic en "Obfuscate"
5. Reemplazar el <script> original con el código ofuscado
6. GUARDAR SIEMPRE el fuente original SIN ofuscar en privado

   IMPORTANTE: Nunca pierdas el fuente original. El código
   ofuscado no es editable.


DISTRIBUCIÓN EN GUMROAD
─────────────────────────
El producto que se vende en Gumroad NO es el archivo HTML.
Es el LINK a la PWA + instrucciones de instalación.

Configuración del producto Gumroad:
- Tipo: Digital product
- Precio: $18 USD
- Archivo a entregar: un PDF o TXT con:
  * Link a la PWA: https://TU-SITIO.netlify.app/2SIS.html
  * Instrucciones de instalación (Android + iOS)
  * Contacto de soporte

Email automático de Gumroad al comprador:
  "Gracias por tu compra de 2SIS Dosis Pediátrica.
   
   Tu link de acceso: https://TU-SITIO.netlify.app/2SIS.html
   
   Al abrir el link, el sistema te pedirá aceptar los términos
   de uso y registrar tu nombre de licencia.
   
   Para instalar como app:
   Android: Menú (⋮) → Instalar app
   iOS: Compartir (⬆) → Agregar a pantalla de inicio"


SOPORTE Y ACTUALIZACIONES
───────────────────────────
Compradores registrados reciben actualizaciones automáticamente
cuando reabren la app con conexión a internet.

No es necesario volver a Gumroad para las actualizaciones.
El link siempre apunta a la versión más reciente.


═══════════════════════════════════════════════════════════
  Apache90 · 2SIS v1.0 · 2026
  Este paquete es confidencial — no redistribuir
═══════════════════════════════════════════════════════════
