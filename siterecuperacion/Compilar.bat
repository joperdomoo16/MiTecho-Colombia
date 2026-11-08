@echo off
cd /d "%~dp0"
echo Compilando servidor Java de MiTecho...
if not exist "bin" mkdir bin
javac -d bin *.java
if %ERRORLEVEL% EQU 0 (
    echo Compilacion lista en bin. Ahora puedes abrir Iniciar.bat
) else (
    echo Ocurrio un error al compilar los archivos Java.
)
pause
