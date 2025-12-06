# Script para compilar y ejecutar el backend
# Ejecutar desde la carpeta backend

Write-Host "Compilando el backend..." -ForegroundColor Cyan

# Limpiar y compilar
./gradlew clean build -x test

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilación exitosa!" -ForegroundColor Green
    Write-Host "Ejecutando el backend..." -ForegroundColor Cyan
    ./gradlew bootRun
} else {
    Write-Host "Error en la compilación. Revise los errores arriba." -ForegroundColor Red
    exit 1
}
