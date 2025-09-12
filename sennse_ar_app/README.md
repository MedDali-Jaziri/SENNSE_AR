# SENNSE-AR Ionic Microservice

This repository contains the **SENNSE-AR Ionic microservice**, which provides the **mobile application** for the SENNSE-AR platform.  
It extends the Angular-based web application to deliver the same immersive AR experience on **Android and iOS devices**.

---

## 🎯 Objective

This README explains how the Ionic microservice is structured, how it works, and how you can run or extend it if you would like to improve functionality.  

The mobile app is built with **Ionic + Angular**, following a modular architecture that makes it easy to maintain, scale, and deploy across platforms.

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

**🔑 Authentication Note:**  Some variables inside these files are related to the **authentication process** (e.g., backend credentials).  
👉 You must update these variables with your own values in order to run the application successfully.

---

### 2. **`app/model/`**
- Contains **model interfaces** representing the data structures used within the mobile app.  
- Benefits of defining models in Ionic/Angular:
  - Strong **type safety** when handling API responses.  
  - Easier debugging and reduced runtime errors.  
  - Centralized definitions for consistent data usage.  
- Example: An ` Sensor` interface that defines fields such as sensorId, sensorName, and sensorDescription.

---

### 3. **`app/modules/`**
- Contains all **components and pages** of the mobile application.  
- In Ionic, components represent reusable UI parts, while **pages** serve as full-screen views (e.g., login, dashboard, settings).  
- Each page/module includes:
  - A **TypeScript file** (logic).  
  - An **HTML template** (UI structure).  
  - A **SCSS file** (styling).  
- Example:
  - `NewRoomComponent.ts` → Handles the creation of the rooms.
  - `RoomDetailComponent.html` → Displays AR content and room details.  

---

### 4. **`app/service/`**
- Contains the **business logic layer** for the Ionic application.
- Responsible for communication with backend microservices (Spring Boot, Express.js).  
- Typical responsibilities:
  - Handling **HTTP requests** with Angular’s `HttpClient`.  
  - Providing reusable logic for pages/components.  
---

## ▶️ Running the Application

### Prerequisites
- [Node.js 18+](https://nodejs.org/)  
- [Ionic CLI](https://ionicframework.com/docs/cli)  
- [Angular CLI](https://angular.io/cli)  
- (Optional) Android Studio or Xcode for mobile builds  

### Run in Browser (Dev Mode)
```bash
# Clone repository
git https://github.com/MedDali-Jaziri/SENNSE_AR.git
cd cd SENNSE_AR/sennse_ar_app

# Install dependencies
npm install

# Run application in browser
ionic serve
```
### Run on Android
```bash
# Build android infrastructure file
ionic capacitor build android

# Run the generator file under Android Studio
ionic capacitor run android
```
---
## 📖 Future Improvements
- Implement offline mode for AR experiences.
- Enhance push notification support for real-time updates.
- Improve performance on low-end mobile devices.

---
## 🤝 Contribution

We welcome contributions!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to your fork (`git push origin feature-name`).
5. Open a Pull Request.