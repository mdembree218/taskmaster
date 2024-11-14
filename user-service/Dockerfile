FROM openjdk:17
COPY target/user-service-0.0.1-SNAPSHOT.jar /usr/src/user-service/
WORKDIR /usr/src/user-service
EXPOSE 8083
CMD ["java", "-jar", "user-service-0.0.1-SNAPSHOT.jar"]