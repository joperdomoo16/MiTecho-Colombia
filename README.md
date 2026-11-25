# MiTecho Colombia

Aplicación para celulares Android hecha con Capacitor, JavaScript y Supabase. Calcula hasta cuánto puede prestar un banco para comprar vivienda en Colombia (VIS, No VIS y leasing habitacional), ayuda a organizar deudas y registros diarios en pesos, y compara las tasas vigentes reportadas ante la Superintendencia Financiera.

## Cómo está armado el proyecto

- `index.html`: entrada principal empacada en Capacitor con política CSP cerrada.
- `css/`: hojas de estilo separadas por pantalla (`Fuentes.css`, `Estilos.css`, `Componentes.css`, `Formularios.css`, `Vistas.css`, `Entrada.css`, `Invitado.css`, `Tutorial.css`, `Tipovivienda.css`, `Inicio.css`, `Plan.css`, `Movimientos.css`, `Simulador.css`, `Registrar.css`, `Bancos.css`, `Viviendas.css`, `Reporte.css`, `Subsidios.css`, `Perfil.css`, `Ayuda.css`).
- `assets/`: íconos, imágenes de proyectos en WebP y fuentes locales para no depender de internet al abrir.
- `js/`: reglas de negocio, estado y motor de vistas:
  - `Constantesbancarias.js` y `Listaciudades.js`: valores legales de 2026 (SMMLV, UVT, topes VIS y VIP por municipio), paleta de colores y tasas base.
  - `Validaciones.js`: topes financieros y limpieza de textos, montos y nombres de cédula.
  - `Motorsubsidios.js`, `Motorcalculo.js` e `Historialregistros.js`: cupo de crédito, cuota mensual, subsidios de Caja y Mi Casa Ya, proyección en UVR y promedio de ingresos.
  - `Tasasmercado.js`, `Proyectosaliados.js`, `Valorestasas.js` y `Valoresviviendas.js`: comparador de tasas por banco y listado de proyectos de referencia por ciudad.
  - `Logocertificado.js`, `Estiloscertificadobase.js`, `Estiloscertificado.js`, `Reportedatos.js`, `Generadorpdfsecciones.js`, `Generadorpdfhojatres.js`, `Generadorpdf.js`, `Visorcertificado.js` y `Valoresreporte.js`: armado de las tres hojas del reporte de simulación y su visor para guardar en PDF.
  - `Servicioapi.js`, `Respaldonube.js`, `Almacenamiento.js` y `Migraciondatos.js`: conexión con Supabase, respaldo del perfil y guardado local en el celular.
  - `Valoresacceso.js`, `Sesionusuario.js`, `Sesioninvitado.js` y `Valoresinvitado.js`: inicio de sesión con Google o correo, cierre de cuenta y uso sin cuenta en el celular.
  - `Navegacionatras.js` y `Temaautomatico.js`: historial del botón atrás y cambio entre tema claro, oscuro o automático.
  - `Anuncios.js` y `Gestiondeudaspdf.js`: integración con AdMob, edición de deudas y recordatorios nativos.
  - `Motorvista.js` y `Aplicacion.js`: actualización del DOM (`mt-if`, `mt-for`) y arranque general.
- `vistas/`: plantillas HTML de portada, pestañas, paneles de detalle, hojas desplegables y recorrido inicial.
- `android/`: proyecto nativo Android (`co.mitecho.app`) con inicio de sesión de Google, guardado cifrado en Android Keystore (`AlmacenSeguro.java`), alarmas locales de racha y efectivo (`NotificadorRacha.java`, `ReceptorAlarmaRacha.java`) y manejo del botón atrás (`ActividadPrincipal.java`).
- `Preparardist.js`: script que limpia comentarios y empaca los archivos listos para el APK dentro de `dist/`.

## Cómo compilar

1. Instalar dependencias en el computador:
   ```bash
   npm install
   ```
2. Preparar la carpeta `dist/` y sincronizar con Android:
   ```bash
   node Preparardist.js
   npx cap sync android
   ```
3. Generar el archivo firmado de publicación:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

## Seguridad y tratamiento de datos

- Los tokens de sesión se guardan cifrados con AES-256-GCM dentro de Android Keystore (`AlmacenSeguro.java`).
- Las capturas de pantalla están bloqueadas (`FLAG_SECURE`) y toda la comunicación sale únicamente por HTTPS.
- Quien entra sin cuenta conserva su información solo en su celular hasta que decida vincular un correo o cuenta de Google.
- Los formularios acotan cada cifra en el cliente y las tablas en Supabase aplican reglas RLS y restricciones `CHECK`.
- La política de privacidad bajo la Ley 1581 de 2012 está publicada en [https://mitecho-co.web.app/](https://mitecho-co.web.app/).
