FROM openjdk:17
COPY target/notification-service-0.0.1-SNAPSHOT.jar /usr/src/notification-service/
WORKDIR /usr/src/notification-service
EXPOSE 8084
CMD ["java", "-jar", "notification-service-0.0.1-SNAPSHOT.jar"]