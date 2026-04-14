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

COPY --from=build /build/target/*.jar /app/app.jar

EXPOSE 8080
USER spring

ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
