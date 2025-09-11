# SENNSE-AR Angular Microservice

This repository contains the **SENNSE-AR Angular microservice**, which provides the **web interface** for the SENNSE-AR platform.  
It allows users to interact with AR features and communicates with backend microservices (Spring Boot, Express.js) to deliver a seamless experience.

---

## 🎯 Objective

This README explains how the Angular microservice is structured, how it works, and how you can run or extend it if you would like to improve functionality.  

The frontend is built with **Angular** and follows a modular architecture, making the application easy to maintain and scale.

---

## 📂 Project Structure

The project is organized into the following key directories:

### 1. **`environment/`**
- Contains TypeScript files that define **environment variables**.  
- Provides two configurations:
  - `environment.ts` → for development.  
  - `environment.prod.ts` → for production.  
- These files define API URLs and other constants used during requests.  
- This separation allows easy switching between development and production without code changes.

---

### 2. **`app/model/`**
- Contains **model interfaces** that represent the data structures used throughout the application.  
- In Angular, creating models helps:
  - Provide **type safety** when handling data.  
  - Improve maintainability by centralizing object definitions.  
  - Prevent errors by making sure data conforms to expected structures.  
- Example: An `Sensor` interface that defines fields such as `sensorId`, `sensorName`, and `sensorDescription`.

---

### 3. **`app/modules/`**
- Contains all **components** of the web application.  
- Components are the **building blocks** of Angular applications.  
- Each component typically includes:
  - A **TypeScript file** for logic.  
  - An **HTML template** for structure.  
  - A **CSS/SCSS file** for styling.  
- Example:  
  - `NewRoomComponent.ts` → Handles the creation of the rooms.  
  - `RoomDetailComponent.html` → Displays AR content and room details.  
---

### 4. **`app/service/`**
- Contains the **business logic layer** for the Angular application.
- Responsible for communication with backend microservices (Spring Boot, Express.js).
- Services typically:
  - Handle **HTTP requests** using Angular’s `HttpClient`  
  - Provide reusable logic across components. 
---

## ▶️ Running the Application

### Prerequisites
- [Node.js 18+](https://nodejs.org/)  
- [Angular CLI](https://angular.io/cli)  

### Run Locally
```bash
# Clone repository
git clone https://github.com/MedDali-Jaziri/SENNSE_AR.git
cd SENNSE-AR/SENNSE-AR

# Install dependencies
npm install

# Run development server
ng serve
```
#### Application will be available at:  👉 http://localhost:4200

### Build for Production
``` bash
ng build --configuration production
```
---
## Future Improvement
- Add lazy loading for improved performance on larger apps.
- Integrate state management(e.g., NgRx) for better handling of complex data flows.
- Enhance error handling for backend communication.
- Improve test coverage with Jasmine/karma.

---

## 🤝 Contribution

We welcome contributions!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to your fork (`git push origin feature-name`).
5. Open a Pull Request.