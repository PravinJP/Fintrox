FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY Backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]