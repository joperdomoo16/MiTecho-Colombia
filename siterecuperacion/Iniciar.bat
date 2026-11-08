@echo off
cd /d "%~dp0"
echo Iniciando servidor Java de MiTecho en http://localhost:8080/
java -cp bin siterecuperacion.ServidorRestablecer
pause
