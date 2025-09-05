# Use OpenJDK as base image (use version that matches your project)
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY ./target/sennse-ar-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (optional, for documentation)
EXPOSE 8443

# Declare a volume space for uploads folders files
VOLUME ["/app/uploads"]

# Command to run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]