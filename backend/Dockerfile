# Tahap Build: Menggunakan Maven dan Java 22
FROM maven:3.9.7-eclipse-temurin-22 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build aplikasi tanpa menjalankan testing untuk mempercepat proses
RUN mvn clean package -DskipTests

# Tahap Run: Menjalankan aplikasi dengan Java 22
FROM eclipse-temurin:22-jdk-jammy
WORKDIR /app
# Menyalin file .jar hasil build dari tahap sebelumnya
COPY --from=build /app/target/*.jar app.jar

# Render akan menggunakan port yang diekspos ini
EXPOSE 8080

# Perintah untuk menjalankan Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]