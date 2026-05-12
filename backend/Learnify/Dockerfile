FROM maven:3.8.8-eclipse-temurin-17-alpine AS build

WORKDIR /app
COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/Learnify-0.0.1-SNAPSHOT.jar Learnify.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "Learnify.jar"]