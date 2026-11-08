# MiTecho Colombia

**MiTecho** es una aplicación móvil para celulares **Android e iOS**, creada por **RumoriaStudio** para ayudar a las familias colombianas a conocer su capacidad real de crédito hipotecario, organizar sus ingresos diarios y proyectar el cierre financiero de su vivienda con subsidios de Caja de Compensación y programas vigentes en 2026.

## Arquitectura Modular de la Aplicación Móvil

El proyecto está organizado en módulos independientes para que cada archivo tenga una responsabilidad clara y se mantenga por debajo de las 400 líneas de código:

- `index.html`: contenedor base de la aplicación móvil para el visor nativo de Capacitor en Android e iOS.
- `css/`: hojas de estilo divididas en `styles.css`, `Formularios.css` y `Vistas.css`.
- `js/`: lógica financiera, estado y servicios:
  - `Constantesbancarias.js`: salario mínimo legal vigente, unidad de valor tributario, tasas de referencia y topes de vivienda en municipios de Colombia.
  - `Listaciudades.js` y `Proyectosaliados.js`: directorio de municipios colombianos y proyectos de vivienda.
  - `Motorcalculo.js`: cálculo de cupo máximo de crédito, cuota mensual, subsidios y gastos de escrituración según la Ley 546 de 1999.
  - `Estiloscertificado.js`, `Generadorpdfhojatres.js` y `Generadorpdf.js`: generación del certificado de capacidad financiera en tres hojas.
  - `Servicioapi.js`, `Almacenamiento.js` y `Sincronizacion.js`: conexión con Supabase para autenticación de usuarios, guardado en el almacenamiento del celular y respaldo en la nube.
  - `Estadobase.js`, `Valoresinicio.js`, `Valoresingresos.js`, `Valoressimulador.js`, `Valoresperfil.js`, `Valoresadicionale.js` y `Valorespantallas.js`: preparación de datos para cada sección de la aplicación.
  - `engine.js` y `app.js`: motor reactivo y controlador principal del ciclo de vida móvil.
- `vistas/`: plantillas modulares de cada pantalla (`Plantillabienvenida.js`, `Plantillaperfilusuario.js`, `Plantillaayuda.js`, `Plantillanavegacionsuperior.js`, `Plantillaperfil.js`, `Plantillaingresosplan.js`, `Plantillaprincipal.js` y `Plantillamodales.js`).
- `android/`: proyecto nativo de Android Studio configurado con R8 en modo completo, perfil de arranque `baseline-prof.txt` e inicio de sesión nativo con Google.
- `siterecuperacion/`: microservicio en Java 21 (`ServidorRestablecer.java`, `ManejadorEstatico.java`, `ManejadorApi.java` y `ClienteSupabase.java`) junto con la vista móvil de restablecimiento de contraseña que se abre cuando el usuario da clic en el enlace enviado a su correo.
- `correos/`: plantillas oficiales en HTML (`Confirmarcorreo.html`, `Restablecercontrasena.html` y `Contrasenacambiada.html`) para configurar en Supabase con el remitente **RumoriaStudio, creadores de MiTecho**.
- `test/`: pruebas automatizadas de sintaxis, límite de líneas por módulo (`Verificarmodulos.js`), casos financieros (`Verificarcasos.js`) y certificado (`Verificarpdf.js`).

## Compilación y Pruebas

1. Para ejecutar las pruebas automatizadas de los módulos y del motor financiero:
   ```bash
   npm test
   ```
2. Para empacar los archivos hacia el contenedor nativo de Android e iOS:
   ```bash
   node Preparardist.js
   npx cap copy android
   ```
3. Para probar localmente el servicio en Java de recuperación de contraseña:
   - Entra a la carpeta `siterecuperacion`.
   - Ejecuta `Compilar.bat` y luego `Iniciar.bat`.

## Sitios Legales y Políticas de Privacidad (Firebase Hosting)

Los sitios legales oficiales requeridos para el cumplimiento normativo en Colombia (Ley 1581 de 2012) y para las fichas de Google Play Store y App Store están desplegados en Firebase Hosting bajo el dominio oficial:

- **Portal de Transparencia y Privacidad:** [https://mitecho-co.web.app/](https://mitecho-co.web.app/)
- **Política de Tratamiento de Datos Personales:** [https://mitecho-co.web.app/Politicadeprivacidad](https://mitecho-co.web.app/Politicadeprivacidad)
- **Eliminación de Cuenta y Datos:** [https://mitecho-co.web.app/Eliminarcuenta](https://mitecho-co.web.app/Eliminarcuenta)
- **Canal Oficial de Privacidad y Soporte:** [rumoriastudio@gmail.com](mailto:rumoriastudio@gmail.com)

Los archivos fuente se encuentran en la carpeta [`sitiolegal/`](sitiolegal/) y se despliegan con:
```bash
npx firebase-tools deploy --only hosting
```


