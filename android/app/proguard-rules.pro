# Reglas para conservar la comunicación entre la pantalla de la aplicación y el código nativo de Android
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepattributes SourceFile,LineNumberTable

-keep public class co.mitecho.app.MainActivity { *; }
-keepclassmembers class co.mitecho.app.MainActivity$* {
    @android.webkit.JavascriptInterface <methods>;
    public *;
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.getcapacitor.** { *; }
