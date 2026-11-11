# Reglas para conservar la comunicación entre la pantalla de la aplicación y el código nativo de Android
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepattributes SourceFile,LineNumberTable

-keep public class co.mitecho.app.ActividadPrincipal { *; }
-keep public class co.mitecho.app.PuenteNativo {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.getcapacitor.** { *; }
