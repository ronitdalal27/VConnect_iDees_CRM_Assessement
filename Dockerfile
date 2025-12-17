# ========= BUILD STAGE =========
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml first (for dependency caching)
COPY app/pom.xml ./pom.xml
RUN mvn -B dependency:go-offline

# Copy source code
COPY app/src ./src

# Build the application
RUN mvn -B clean package -DskipTests


# ========= RUNTIME STAGE =========
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy jar from build stage
COPY --from=builder /build/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run application
ENTRYPOINT ["java","-jar","app.jar"]
