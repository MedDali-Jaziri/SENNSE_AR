# SENNSE-AR Spring Boot Microservice

This repository contains the **Spring Boot microservice** that acts as the core engine of the SENNSE-AR platform.  
It is designed to handle API requests, manage authentication, and execute business logic in a **modular, scalable, and maintainable** way.

---

## 🎯 Objective

This README demonstrates how the microservice works and provides guidance on how to run and extend it in case you want to improve functionality.  

The service is built on **Spring Boot** and follows a **layered architecture** with clearly separated concerns for better maintainability.

---

## 📂 Project Structure

The project is organized into several main packages, each with its own responsibility:

### 1. **`component/`**
- Contains classes that rely on **Dependency Injection (DI)**.  
- Allows Spring to manage class lifecycle and automatically inject dependencies where needed.  
- Example use cases:
  - Defining reusable beans (e.g., base URLs, configuration values).  
  - Running scheduled tasks or event-driven actions.  
- **Example:**  
  A class that refreshes an **authentication token** every hour is injected into the Spring context. Thanks to DI, this process runs automatically without explicitly calling the class each time.

---

### 2. **`configurator/`**
- Holds configuration classes.  
- Works with **Spring’s DI mechanism** to centralize all configuration logic.  
- Example: Defining API keys, connection pools, or CORS rules.

---

### 3. **`controller/`**
- Contains REST controllers that define **API endpoints**.  
- Responsible for:
  - Exposing routes (e.g., `/sennse-ar/qr-code-generate`, `/sennse-ar/list-board/`).  
  - Handling HTTP requests (GET, POST, PUT, DELETE).  
  - Returning appropriate HTTP responses.  

---

### 4. **`model/`**
- Represents the **data model** used internally.  
- Acts as the schema for data manipulation, similar to how entities map to a database.  
- In this microservice:
  - Data is stored as **JSON objects** instead of relational tables.  
  - Models are designed to encapsulate the structure of this JSON-based persistence.  
- Provides a clean way to pass structured data across services.

---

### 5. **`payload/`**
- Contains **request and response objects**.  
- Implements the **serialization and deserialization layer** for APIs.  
- Benefits:
  - Ensures a strict contract between the frontend and backend.  
  - Makes request/response handling more robust and type-safe.  
- **Example:**
  - `SENNSE_JSON_GENERATOR_REQUEST` → defines fields for JSON generator.  
  - `JSON_GENERATOR_POST_RESPONSE` → wraps response HTTPStatus, Info Message and File Location. 

---

### 6. **`services/`**
- Contains the **business logic layer**.  
- Controllers pass requests to services, where actual computation and processing happen.  
- Example responsibilities:
  - Validating user inputs.  
  - Refreshing tokens and managing authentication.  
  - Generating QR codes or handling AR-related operations.  
- Keeps the system modular: services can be tested and extended independently.

---

## 🔑 Authentication

- For security, update the class **`SENNSE_AUTH_REQUEST`** with your backend credentials. 
- These credentials are required to let the microservice authenticate and run without errors.  
- ⚠️ **Do not commit sensitive credentials to the repository** — use environment variables or a secrets manager for production deployments.

---

## ▶️ Running the Service

### Prerequisites
- [Java 17+](https://adoptium.net/)  
- [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/)  
- (Optional) [Docker](https://www.docker.com/) for containerized deployment  

### Run Locally
```bash
# Clone repository
git clone https://github.com/your-org/SENNSE-AR-MS-SB.git
cd SENNSE-AR-MS-SB

# Build project
mvn clean install

# Run application
mvn spring-boot:run
```
### Run Locally
```bash
# Build the Docker Image
Docker build -t meddali/sennse-ar-springboot:latest .

# Run the Docker Image
Docker run -r 8433:8443 meddali/sennse-ar-springboot:latest
```

---
## 📖 Future Improvements
- Externalize authentication credentials into environment variables.
- Add persistent storage integration (PostgreSQL, MongoDB, or cloud DB).
- Expand unit and integration test coverage.
- Introduce CI/CD pipelines for automated deployment.

---
## 🤝 Contribution
We welcome contributions!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to your fork (`git push origin feature-name`)
5. Open a Pull Request.

