@echo off
REM Script para compilar el proyecto backend
REM Ejecutar desde: C:\UNMSM\DISEÑO\Mod-Ventas\backend

echo ========================================
echo Compilando proyecto backend...
echo ========================================
echo.

REM Limpiar el proyecto
echo [1/3] Limpiando proyecto anterior...
call gradlew.bat clean
if errorlevel 1 (
    echo ERROR: Fallo en la limpieza del proyecto
    pause
    exit /b 1
)

echo.
echo [2/3] Compilando codigo Java...
call gradlew.bat compileJava
if errorlevel 1 (
    echo ERROR: Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo [3/3] Construyendo proyecto completo...
call gradlew.bat build -x test
if errorlevel 1 (
    echo ERROR: Fallo en la construccion
    pause
    exit /b 1
)

echo.
echo ========================================
echo COMPILACION EXITOSA!
echo ========================================
echo.
echo El proyecto se ha compilado correctamente.
echo Puedes ejecutar la aplicacion con: gradlew.bat bootRun
echo.
pause

