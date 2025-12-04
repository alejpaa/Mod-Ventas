# Etapa 1: Build
FROM gradle:8.14.0-jdk21-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración de Gradle
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle
COPY gradlew ./

# Descargar dependencias (se cachea si no cambian)
RUN ./gradlew dependencies --no-daemon || true

# Copiar código fuente
COPY src ./src

# Construir la aplicación (sin tests para build más rápido)
RUN ./gradlew bootJar -x test --no-daemon

# Etapa 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Crear usuario no-root por seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar el JAR desde la etapa de build
COPY --from=builder /app/build/libs/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV JAVA_OPTS="-Xmx512m -Xms256m" \
    PORT=8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

