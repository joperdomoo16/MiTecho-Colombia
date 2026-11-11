# MiTecho Colombia

**MiTecho** es una app para celulares **Android e iOS**, creada por **RumoriaStudio** para ayudar a las familias colombianas a conocer su capacidad real de crédito hipotecario, organizar sus ingresos diarios y proyectar el cierre financiero de su vivienda con subsidios de Caja de Compensación y programas vigentes en 2026.

## Cómo está organizada la app

Cada archivo tiene una sola responsabilidad y se mantiene por debajo de las 400 líneas de código:

- `index.html`: contenedor de la app que abre el visor nativo de Capacitor en el celular.
- `css/`: `Fuentes.css` (fuentes empacadas en la app), `styles.css`, `Formularios.css` y `Vistas.css`.
- `assets/`: logos en WebP, fuentes en `assets/fuentes/` y fotos de los proyectos de vivienda en `assets/proyectos/`, todo dentro de la app para que cargue rápido y sin internet.
- `js/`: lógica financiera, estado y servicios:
  - `Constantesbancarias.js`: salario mínimo legal vigente, unidad de valor tributario, tasas de referencia y topes de vivienda en municipios de Colombia.
  - `Listaciudades.js` y `Proyectosaliados.js`: directorio de municipios colombianos y proyectos de vivienda.
  - `Motorcalculo.js`: cálculo de cupo máximo de crédito, cuota mensual, subsidios y gastos de escrituración según la Ley 546 de 1999.
  - `Estiloscertificado.js`, `Generadorpdfhojatres.js`, `Generadorpdf.js` y `Visorcertificado.js`: armado del certificado de capacidad financiera en tres hojas y el visor para guardarlo como PDF.
  - `Servicioapi.js`, `Migraciondatos.js` y `Almacenamiento.js`: conexión con Supabase, guardado en el celular y conversión de los datos de versiones anteriores.
  - `Estadobase.js`, `Valoresinicio.js`, `Valoresingresos.js`, `Valoressimulador.js`, `Valoresperfil.js`, `Valoresadicionales.js` y `Valorespantallas.js`: preparación de los datos de cada sección.
  - `Valoresautorizacion.js`: ventana que pide la autorización de tratamiento de datos antes de usar la app.
  - `Valorescuenta.js`: borrar la cuenta (con aviso de que no se puede deshacer) y mandar la copia de los datos al correo.
  - `Anuncios.js`: banner y video con recompensa de AdMob (hoy con los ID de prueba de Google).
  - `Tasasmercado.js` y `Valorestasas.js`: tasas de vivienda por entidad de la Superintendencia Financiera (las usa el cálculo con 0,5 puntos de margen prudente) y la sección Pro "Tasas por banco".
  - `Racha.js`: racha de días seguidos con registros, contada con las fechas reales en que se anota un ingreso o un gasto.
  - `Valoresavisoperfil.js`: aviso de la primera vez que se entra, que invita a completar el perfil financiero.
  - `engine.js` y `app.js`: motor que dibuja las pantallas y controlador principal de la app.
- `vistas/`: plantillas de cada pantalla (`Plantillabienvenida.js`, `Plantillaperfilusuario.js`, `Plantillaayuda.js`, `Plantillanavegacionsuperior.js`, `Plantillaperfil.js`, `Plantillaingresosplan.js`, `Plantillaprincipal.js`, `Plantillamodales.js`, `Plantillaautorizacion.js`, `Plantillaeliminacion.js`, `Plantillaavisoperfil.js` y `Plantillatasas.js`). Los eventos se escriben con atributos `al-clic`, `al-escribir` y similares, nunca con `onclick`.
- `android/`: proyecto nativo de Android Studio con R8 en modo completo y perfil de arranque `baseline-prof.txt`. El código Java está en `co.mitecho.app`:
  - `ActividadPrincipal.java`: pantalla principal, barras del celular e inicio de sesión con Google.
  - `PuenteNativo.java`: funciones que la interfaz llama con `window.Puentenativo` (barras, Google, sesión cifrada y bloqueo de capturas).
  - `AlmacenSeguro.java`: guarda la sesión cifrada con AES-256-GCM y una llave del Keystore del celular.
- `siterecuperacion/`: páginas a las que llevan los enlaces de los correos, publicadas en Firebase Hosting y conectadas directo con Supabase:
  - `index.html` en [https://mitecho-co.web.app/Restablecercontrasena](https://mitecho-co.web.app/Restablecercontrasena): formulario para crear la contraseña nueva.
  - `Correoconfirmado.html` en [https://mitecho-co.web.app/Correoconfirmado](https://mitecho-co.web.app/Correoconfirmado): aviso de correo confirmado o de enlace vencido.
  - `logica/` y `estilos/`: código y diseño compartidos por las dos páginas.
- `sitiolegal/`: portal de transparencia, política de privacidad, términos de uso, eliminación de cuenta y `Correolegal.js` para los enlaces de correo y los botones de copiar.
- `correos/`: plantillas en HTML (`Confirmarcorreo.html`, `Restablecercontrasena.html`, `Contrasenacambiada.html`, `Bienvenida.html` y `Avisoinactividad.html`) para configurar en Supabase con el remitente **RumoriaStudio, creadores de MiTecho**.
- `hojacalculo/Codigo.gs`: script de Google para la hoja de soporte y autorizaciones; solo acepta filas que manda la función `registrarlegal`.
- `test/`: pruebas de sintaxis y límite de líneas (`Verificarmodulos.js`), casos financieros (`Verificarcasos.js`), certificado (`Verificarpdf.js`), seguridad (`Verificarseguridad.js`) festivos y plazos de respuesta (`Verificarplazos.js`, necesita Node 23.6 o superior) textos del reporte PDF (`Verificarreporte.js`) y techo, fuente de ingreso y racha del inicio (`Verificarinicio.js`).

## Correo de bienvenida

Supabase no trae plantilla de bienvenida, así que la envía la función `supabase/functions/enviarbienvenida`. La app la llama después de cada inicio de sesión y la función manda el correo solo la primera vez (con Google, en el primer ingreso; con correo y contraseña, en el primer ingreso después de confirmar el correo). Para dejarla funcionando:

1. Si cambias `correos/Bienvenida.html` o `correos/Avisoinactividad.html`, actualiza la copia dentro de las funciones con `node supabase/Actualizarplantilla.js`.
2. En Supabase, entra a **Edge Functions > Secrets** y crea `SMTP_HOST`, `SMTP_PORT` (465), `SMTP_USER`, `SMTP_PASS` y `SMTP_FROM` con los mismos datos del correo que ya envía las confirmaciones.
3. Publica la función con `npx supabase functions deploy enviarbienvenida` (o crea la función en el panel con los dos archivos de la carpeta).

## Soporte y autorización de datos (Ley 1581 de 2012)

La app nunca habla directo con Google. Las solicitudes de soporte (desde **Ayuda** y desde **Contáctanos** del inicio de sesión) y la autorización que se pide al entrar por primera vez van a la función `supabase/functions/registrarlegal`, que:

- Guarda la prueba en las tablas `solicitudes_soporte` y `autorizaciones`, que solo la función puede leer y escribir.
- Calcula la fecha máxima de respuesta en días hábiles de Colombia, sin festivos: soporte técnico 15 días (Ley 1755 de 2015), consulta de datos 10 días y reclamo 15 días (Ley 1581 de 2012).
- Da un número de radicado, avisa a soporte por correo y le manda a la persona un acuse de recibo con su radicado y la fecha máxima.
- Copia la fila en la hoja de Google (pestañas **Soporte** y **Autorizaciones**) con una clave que solo conoce el servidor.

Para dejarla funcionando:

1. En Supabase, **SQL Editor**: pega y corre `supabase/Tablaslegales.sql`.
2. Crea una hoja de Google, entra a **Extensiones > Apps Script**, pega `hojacalculo/Codigo.gs` y en **Configuración del proyecto > Propiedades del script** crea `CLAVE` con una clave larga al azar (mínimo 32 caracteres). Publícala en **Implementar > Nueva implementación > Aplicación web**, ejecutar como *Yo* y acceso para *Cualquier usuario*.
3. En Supabase, **Edge Functions > Secrets**: crea `HOJA_URL` (la dirección que termina en `/exec`), `HOJA_CLAVE` (la misma clave) y `CORREO_SOPORTE` (rumoriastudio@gmail.com). Usa los mismos `SMTP_*` de la bienvenida.
4. Publica la función `registrarlegal` con sus siete archivos (`index.ts`, `Festivos.ts`, `Notificaciones.ts`, `Cuenta.ts`, `Inactividad.ts`, `Plazoinactividad.ts` y `Plantillainactividad.ts`) y con **Verify JWT** apagado (la función revisa la sesión por su cuenta).
5. Si cambias la política de privacidad, sube `Versionpolitica` en `js/Valoresautorizacion.js` y en la función, y la versión en `sitiolegal/Politicadeprivacidad.html`; la ventana de autorización volverá a salir a todos. `npm test` avisa si las tres no coinciden.

## Cuenta, Pro, anuncios e inactividad

- **Borrar la cuenta**: desde *Mi perfil financiero → Borrar mi cuenta*. La función `registrarlegal` (acción `eliminar`) guarda la constancia en `eliminaciones` y en la pestaña **Eliminaciones** de la hoja, borra las filas en `perfiles_financieros`, `transacciones`, `certificados` y `leads_comerciales` y llama a `auth.admin.deleteUser`. Las solicitudes de soporte y las autorizaciones se conservan. Antes de usarla corre `supabase/Tablacuenta.sql`.
- **Copia de datos**: *Enviar mis datos a mi correo* manda un JSON al correo de la cuenta (máximo 3 por día).
- **Sesión**: la app guarda cifrado el token de renovación y pide uno nuevo cuando Supabase responde 401, así las acciones de la cuenta funcionan aunque la persona haya entrado hace días.
- **MiTecho Pro** (pareja o familia, reporte PDF y sin anuncios) lo activa solo el servidor con `app_metadata.pro`. Mientras no esté Google Play Billing, para probarlo con una cuenta corre en el SQL Editor: `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"pro": true}' where email = 'correo@de.prueba';`
- **Anuncios**: `js/Anuncios.js` y `android/app/src/main/res/values/strings.xml` usan los ID de prueba de Google. Al publicar se cambian por los ID reales de AdMob y `Prueba` pasa a `false`.
- **Cuentas sin uso**: `supabase/Tareainactividad.sql` programa una tarea diaria (pg_cron) que borra la cuenta al cumplir 12 meses sin uso, con aviso por correo 30 días antes, como dicen los términos y la política. Si la persona abre la app o inicia sesión después del aviso, el borrado se cancela. Necesita el secreto `TAREA_CLAVE`. El plazo está en `Mesesinactividad` de `Plazoinactividad.ts`.
- **Valores anuales**: cada enero revisa en `js/Constantesbancarias.js` el salario mínimo, la UVT, los topes VIS, los subsidios y `Fechatasasreferencia`.

## Tasas por banco (Superintendencia Financiera)

La función `supabase/functions/actualizartasas` trae de datos.gov.co (conjunto `qzsc-9esp`, Formato 414) las últimas 8 semanas de créditos de vivienda, calcula la tasa promedio ponderada por monto de cada entidad y producto y la guarda en `tasas_vivienda_semanal`. La app solo lee esa tabla y guarda una copia en el celular.

1. Corre `supabase/Tablatasas.sql` en el SQL Editor.
2. Publica la función `actualizartasas` (un archivo, `index.ts`) con **Verify JWT** apagado. Usa el mismo secreto `TAREA_CLAVE`; el secreto `SOCRATA_TOKEN` es opcional.
3. Corre `supabase/Tareatasas.sql` con la clave puesta: actualiza las tasas de martes a viernes a las 6:00 a. m.

El tope de cuota es 40% del ingreso (Decreto 257 de 2021 en VIS y Decreto 583 de 2025 en No VIS), con un modo conservador de 30%.

## Seguridad

- La sesión no queda en texto plano: en el celular se guarda cifrada en el Keystore de Android.
- La app no hace respaldos automáticos de los datos y solo acepta conexiones cifradas (HTTPS).
- En las pantallas con ingresos, deudas y cifras no se pueden tomar capturas.
- La política de seguridad de contenido (CSP) solo deja correr los scripts propios de la app. Si cambias el script de ajuste del certificado en `Generadorpdf.js`, `npm test` te avisa la huella nueva que debes poner en `index.html`.
- Los datos guardados con versiones anteriores se convierten solos a los nombres actuales la primera vez que se abre la app.

## Compilación y pruebas

1. Para correr todas las pruebas:
   ```bash
   npm test
   ```
2. Para empacar la app y pasarla al proyecto de Android:
   ```bash
   node Preparardist.js
   npx cap sync android
   ```
   `Preparardist.js` arma `dist/` sin comentarios: quita comentarios y espacios de los `.js` (Terser) y `.css` (clean-css) y los `<!-- -->` de `index.html`, sin renombrar ni reordenar código. Los archivos del proyecto conservan sus comentarios. `test/Verificardist.js` revisa que la copia salga sin comentarios, con todos los archivos y funcionando igual.
3. Para que los enlaces de los correos funcionen, en Supabase (**Authentication > URL Configuration**) la *Site URL* debe ser `https://mitecho-co.web.app` y en *Redirect URLs* deben estar `https://mitecho-co.web.app/Restablecercontrasena` y `https://mitecho-co.web.app/Correoconfirmado`.

## Sitios legales y políticas de privacidad (Firebase Hosting)

Los sitios legales que exige la Ley 1581 de 2012 y que piden Google Play y App Store están publicados en Firebase Hosting:

- **Portal de Transparencia y Privacidad:** [https://mitecho-co.web.app/](https://mitecho-co.web.app/)
- **Política de Tratamiento de Datos Personales:** [https://mitecho-co.web.app/Politicadeprivacidad](https://mitecho-co.web.app/Politicadeprivacidad)
- **Eliminación de Cuenta y Datos:** [https://mitecho-co.web.app/Eliminarcuenta](https://mitecho-co.web.app/Eliminarcuenta)
- **Canal Oficial de Privacidad y Soporte:** [rumoriastudio@gmail.com](mailto:rumoriastudio@gmail.com)

Los archivos están en la carpeta [`sitiolegal/`](sitiolegal/) y se publican con:
```bash
npx firebase-tools deploy --only hosting
```
