# MiTecho Colombia

Aplicación móvil Android construida con Capacitor, JavaScript modular y Supabase para proyectar capacidad de crédito hipotecario en Colombia (VIS, No VIS y Leasing habitacional), gestionar deudas, registrar movimientos diarios y comparar tasas de referencia de la Superintendencia Financiera.

## Estructura del proyecto

- `index.html`: punto de entrada web empaquetado en Capacitor con política CSP.
- `css/`: hojas de estilo modulares (`Fuentes.css`, `styles.css`, `Componentes.css`, `Formularios.css`, `Vistas.css`, `Entrada.css`, `Invitado.css`, `Tutorial.css`, `Tipovivienda.css`, `Inicio.css`, `Plan.css`, `Movimientos.css`, `Simulador.css`, `Registrar.css`, `Bancos.css`, `Viviendas.css`, `Reporte.css`, `Subsidios.css`, `Perfil.css`, `Ayuda.css`).
- `assets/`: íconos, imágenes en WebP y fuentes tipográficas locales.
- `js/`: lógica de negocio, motor reactivo y estado por pantalla:
  - `Constantesbancarias.js` y `Listaciudades.js`: parámetros legales 2026 (SMMLV, UVT, topes VIS/VIP por municipio), temas claro/oscuro y tasas de referencia.
  - `Validaciones.js`: rangos financieros y sanitización de entradas.
  - `Motorcalculo.js` y `Historialregistros.js`: proyección de cupo de crédito, cuota mensual, subsidios, UVR y metas de ahorro.
  - `Tasasmercado.js`, `Proyectosaliados.js`, `Valorestasas.js` y `Valoresviviendas.js`: comparador de tasas por entidad y catálogo de proyectos de referencia.
  - `Generadorpdf.js`, `Generadorpdfhojatres.js`, `Estiloscertificado.js`, `Reportedatos.js`, `Visorcertificado.js` y `Valoresreporte.js`: generación y vista previa del reporte en PDF.
  - `Servicioapi.js`, `Respaldonube.js`, `Almacenamiento.js` y `Migraciondatos.js`: autenticación, sincronización con Supabase y almacenamiento local.
  - `Sesionusuario.js`, `Sesioninvitado.js` y `Valoresinvitado.js`: inicio de sesión, cierre, vinculación y modo sin cuenta en el dispositivo.
  - `Navegacionatras.js` y `Temaautomatico.js`: botón atrás con historial por pantalla y tema claro, oscuro o automático.
  - `Anuncios.js`: integración con AdMob (banner inferior con altura reservada y videos con recompensa).
  - `engine.js` y `app.js`: motor de plantillas (`mt-if`, `mt-for`) y controlador principal.
- `vistas/`: plantillas HTML modulares de entrada, pestañas principales, pantallas de detalle, hojas modales y recorrido guiado.
- `android/`: proyecto nativo Android (`co.mitecho.app`) con inicio de sesión de Google, almacenamiento cifrado con Android Keystore (`AlmacenSeguro.java`), notificaciones locales de racha y efectivo (`NotificadorRacha.java`, `ReceptorAlarmaRacha.java`) y control nativo del botón atrás (`ActividadPrincipal.java`).
- `Preparardist.js`: empaquetado y minificación hacia `dist/`.

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

- Tokens de sesión cifrados con AES-256-GCM en Android Keystore (`AlmacenSeguro.java`).
- Bloqueo de capturas de pantalla (`FLAG_SECURE`) y tráfico exclusivamente HTTPS.
- Modo sin cuenta con almacenamiento estrictamente local en el dispositivo hasta que la persona decida vincular una cuenta.
- Validación de rangos financieros en cliente y restricciones `CHECK` / políticas RLS en Supabase.
- Política de privacidad y gestión de datos bajo Ley 1581 de 2012 en [https://mitecho-co.web.app/](https://mitecho-co.web.app/).
