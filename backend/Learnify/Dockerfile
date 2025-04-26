FROM maven:3.8.8-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY . /app
WORKDIR /app/backend/Learnify
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/backend/Learnify/target/Learnify-0.0.1-SNAPSHOT.jar learnify.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dhttps.protocols=TLSv1.2", "-jar", "syncra.jar"]
