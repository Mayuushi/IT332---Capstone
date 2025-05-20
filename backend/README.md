<h1 align="center">📚 Learnify Backend</h1>
<p align="center">
  <strong>Spring Boot + MongoDB REST API</strong><br>
  Capstone project for IT332
</p>

---

## 🚀 Tech Stack

- ☕ Java 17
- 🧰 Spring Boot 3.4.4
- 🍃 MongoDB
- 📦 Maven

---

## ⚙️ Setup Instructions

> 💡 The backend is hosted on:

### 🖥️ Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mayuushi/IT332---Capstone.git
   cd backend
   ```

2. **Configure MongoDB Connection:**

   Edit `src/main/resources/application.properties`:

   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/learnify
   server.port=8080
   ```

3. **Build and run:**

   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

---

## 📡 Sample API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/api            | Retrieve             |
| POST   | `/api            | Create               |
| GET    | `/api            | Get                  |
| PUT    | `/api            | Update               |
| DELETE | `/api            | Delete               |

---

## 🧪 Running Tests

```bash
mvn test
```

> Use Postman, curl, or Insomnia to interact with the REST endpoints.

---

## 🗂️ Project Structure

```
Learnify/
├── Controller/         
├── DTO/                
├── Entity/             
├── Repository/         
├── Service/            
└── resources/
    ├── templates/      
    └── application.properties
```

---

## 👨‍💻 Authors

- John Michael Pogoy  
- Shane Adrian C. Opinion  
- Walter Canencia  
- Patrick Oliver Bustamante  
- Patrick Romulo Cabiling  

🎓 **School Project for IT332 – Capstone**

---

## 📄 License

This project is licensed under the **MIT License**.