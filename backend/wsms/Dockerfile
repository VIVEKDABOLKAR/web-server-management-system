FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

RUN chmod +x mvnw && ./mvnw -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN groupadd -r spring && useradd -r -g spring spring

# Copy the main jar (exclude the .original backup)
COPY --from=build /build/target/wsms-*.jar /app/app.jar

RUN mkdir -p /tmp/logs && chown spring:spring /tmp/logs

EXPOSE 8080
USER spring

# Always use port 8080 (Render's PORT env var is handled via -Dserver.port)
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Dserver.port=8080 -jar /app/app.jar"]
