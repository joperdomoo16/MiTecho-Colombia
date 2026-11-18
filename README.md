# MiTecho Colombia

Aplicación móvil Android construida con Capacitor, JavaScript modular y Supabase para proyectar capacidad de crédito hipotecario en Colombia (VIS, No VIS y Leasing habitacional), gestionar deudas, registrar movimientos diarios y comparar tasas de referencia de la Superintendencia Financiera.

## Estructura del proyecto

- `index.html`: punto de entrada web empaquetado en Capacitor con política CSP.
- `css/`: hojas de estilo (`Fuentes.css`, `styles.css`, `Formularios.css`, `Vistas.css`, `Tutorial.css`).
- `assets/`: íconos, imágenes optimizadas en WebP y fuentes tipográficas locales.
- `js/`: lógica de negocio, motor de vistas y servicios:
  - `Constantesbancarias.js` y `Listaciudades.js`: parámetros legales 2026 (SMMLV, UVT, topes VIS/VIP por municipio) y tasas de referencia.
  - `Validaciones.js`: rangos financieros y sanitización de entradas.
  - `Motorcalculo.js` y `Historialregistros.js`: proyección de cupo de crédito, cuota mensual, subsidios, UVR y metas de ahorro.
  - `Tasasmercado.js` y `Valorestasas.js`: comparador de tasas por entidad bancaria.
  - `Generadorpdf.js`, `Generadorpdfhojatres.js`, `Estiloscertificado.js`, `Reportedatos.js` y `Visorcertificado.js`: generación del resumen financiero en PDF.
  - `Servicioapi.js`, `Respaldonube.js`, `Almacenamiento.js` y `Migraciondatos.js`: autenticación, sincronización con Supabase y almacenamiento local.
  - `Anuncios.js`: integración con AdMob (banner y videos con recompensa).
  - `engine.js` y `app.js`: motor reactivo de plantillas (`mt-if`, `mt-for`) y controlador principal.
- `vistas/`: plantillas HTML modulares de cada pantalla y modal.
- `android/`: proyecto nativo Android (`co.mitecho.app`) con inicio de sesión de Google, almacenamiento cifrado con Android Keystore (`AlmacenSeguro.java`), notificaciones locales de racha y efectivo (`NotificadorRacha.java`, `ReceptorAlarmaRacha.java`), y manejo nativo del botón atrás (`ActividadPrincipal.java`).
- `Preparardist.js`: script de empaquetado y minificación hacia `dist/`.

## Desarrollo y compilación

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Empacar la capa web y sincronizar con Android:
   ```bash
   node Preparardist.js
   npx cap sync android
   ```
3. Generar el bundle firmado de producción:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

## Seguridad y privacidad

- Tokens de sesión almacenados con cifrado AES-256-GCM en el Keystore de Android (`AlmacenSeguro.java`).
- Bloqueo de capturas de pantalla (`FLAG_SECURE`) y tráfico exclusivamente HTTPS.
- Registros diarios de ingresos y egresos almacenados localmente en el dispositivo.
- Validación de rangos financieros tanto en cliente como mediante restricciones `CHECK` y políticas RLS en Supabase.
- Política de privacidad y gestión de cuenta publicadas bajo Ley 1581 de 2012 en [https://mitecho-co.web.app/](https://mitecho-co.web.app/).
