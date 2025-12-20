# ========= BUILD STAGE =========
FROM nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml first (dependency cache)
COPY app/pom.xml ./pom.xml
RUN mvn -B dependency:go-offline

# Copy source
COPY app/src ./src

# Build
RUN mvn -B clean package -DskipTests


# ========= RUNTIME STAGE =========
FROM nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
