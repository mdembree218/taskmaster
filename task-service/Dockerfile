FROM openjdk:17
COPY target/task-service-0.0.1-SNAPSHOT.jar /usr/src/task-service/
WORKDIR /usr/src/task-service
EXPOSE 8081
CMD ["java", "-jar", "task-service-0.0.1-SNAPSHOT.jar"]