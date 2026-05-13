<div align="center">

<img src="frontend/learnify/public/LearnifyLogo.png" alt="Learnify Logo" width="120" />

# Learnify

**A gamified learning platform for students and teachers**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Maven](https://img.shields.io/badge/Maven-3.8.8-C71A36?logo=apachemaven&logoColor=white)](https://maven.apache.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Demo Accounts](#demo-accounts)
- [Project Structure](#project-structure)
- [Authors](#authors)

---

## About

Learnify is a capstone project for IT332 — a gamified e-learning platform where teachers can create classes and quizzes, and students earn points, badges, and levels as they complete lessons and assessments.

---

## Tech Stack

### Frontend

| Technology | Version |
|---|---|
| React | 19.1.0 |
| React Router DOM | 7.5.2 |
| Axios | 1.9.0 |
| Recharts | 2.15.3 |
| Styled Components | 6.1.17 |
| Lucide React | 0.507.0 |
| React Modal | 3.16.3 |
| clsx | 2.1.1 |
| react-scripts (CRA) | 5.0.1 |

### Backend

| Technology | Version |
|---|---|
| Java | 17 |
| Spring Boot | 3.4.4 |
| Spring Data MongoDB | (managed by Spring Boot) |
| Spring Boot Actuator | (managed by Spring Boot) |
| Thymeleaf | (managed by Spring Boot) |
| Apache POI (OOXML) | 5.2.5 |
| Lombok | 1.18.36 |
| Maven | 3.8.8 |

### Database & Infrastructure

| Technology | Details |
|---|---|
| MongoDB | Atlas (cloud-hosted) |
| Docker | Multi-stage build via `Dockerfile` |
| JDK Base Image | `eclipse-temurin-17-alpine` (build), `openjdk:17-jdk-slim` (runtime) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Java 17** (JDK)
- **Maven** ≥ 3.8
- A **MongoDB Atlas** connection URI (or a local MongoDB instance)

---

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mayuushi/IT332---Capstone.git
   cd IT332---Capstone/backend/Learnify
   ```

2. **Configure the application**

   Edit `src/main/resources/application.properties` and update the MongoDB URI and Groq API key:

   ```properties
   spring.data.mongodb.uri=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/learnify
   groq.api.key=<your-groq-api-key>
   ```

3. **Build and run**

   ```bash
   mvn clean install -DskipTests
   mvn spring-boot:run
   ```

   The API will be available at `http://localhost:8080`.

4. **Run with Docker** *(optional)*

   ```bash
   # From the repo root
   docker build -f backend/Learnify/Dockerfile -t learnify-backend .
   docker run -p 8080:8080 learnify-backend
   ```

---

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd IT332---Capstone/frontend/learnify
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`.

4. **Build for production**

   ```bash
   npm run build
   ```

   The optimized output is placed in the `build/` folder, ready to be served by any static hosting provider (Netlify, Vercel, etc.).

> **Note:** The frontend expects the backend to be running on `http://localhost:8080`. Update the API base URLs in `src/services/` if deploying to a remote server.

---

## Demo Accounts

The following accounts exist on the live MongoDB Atlas instance and can be used to explore the platform.

### Student Accounts

| Name | Email | Password |
|---|---|---|
| John Doe | `johndoe@student.com` | `student123` |
| Jane Smith | `janesmith@student.com` | `student123` |

### Teacher Accounts

| Name | Email | Password |
|---|---|---|
| Prof. Admin | `teacher@learnify.com` | `teacher123` |
| Ms. Rivera | `msrivera@learnify.com` | `teacher123` |

> **Note:** If the demo accounts above do not work, register a new account via the **Sign Up** page. There are separate registration flows for **Students** and **Teachers**.

---

## Project Structure

```
IT332---Capstone/
├── backend/
│   └── Learnify/
│       ├── src/main/java/com/edu/cit/Learnify/
│       │   ├── Controller/       # REST API controllers
│       │   ├── DTO/              # Data Transfer Objects
│       │   ├── Entity/           # MongoDB document models
│       │   ├── Repository/       # Spring Data repositories
│       │   ├── Service/          # Business logic
│       │   └── Config/           # App configuration
│       ├── src/main/resources/
│       │   └── application.properties
│       ├── Dockerfile
│       └── pom.xml
└── frontend/
    └── learnify/
        ├── public/
        └── src/
            ├── components/       # React UI components
            ├── context/          # Auth context
            └── services/         # API service layer
```

---

## Authors

| Name | Role |
|---|---|
| John Michael Pogoy | Full-stack Developer |
| Shane Adrian C. Opinion | Full-stack Developer |
| Walter Canencia | Full-stack Developer |
| Derrick M. Estopace | Full-stack Developer |
| Patrick Romulo Cabiling | Full-stack Developer |

> 🎓 School Project — IT332 Capstone, CIT University
