# 🚀 SmartCRM AI

> A full-stack, AI-powered Customer Relationship Management platform built with **React, Spring Boot, MySQL, and Google Gemini AI**.

SmartCRM AI is a production-style CRM application designed to help organizations manage customers, leads, activities, documents, analytics, and AI-assisted workflows from a single platform.

The project demonstrates full-stack development, REST API design, JWT authentication, role-based authorization, relational database integration, data visualization, document management, and generative AI integration.

---

## ✨ Features

### 👥 Customer Management

* Create and manage customer profiles
* Store contact information and company details
* Customer segmentation
* Customer notes and history
* Search and manage customer records
* Role-based access control

### 🎯 Lead Management

* Create and track sales leads
* Lead source tracking
* Lead status management
* Deal/pipeline value tracking
* Assigned sales representative
* Lead notes and contact information

### 📋 Activity Management

* Create and manage CRM activities
* Activity types and statuses
* Priority management
* Due-date tracking
* Customer and lead association

### 📅 Calendar

* Visual calendar for CRM activities
* Date-based activity management
* Interactive calendar interface
* Integration with the activities module

### 📁 Document Management

* Upload customer-related documents
* Categorize documents
* Associate documents with customers or leads
* Store document metadata
* Role-based document deletion
* Backend file-storage architecture

### 📊 Analytics Dashboard

Interactive analytics powered by real CRM data:

* Customer statistics
* Lead statistics
* Sales pipeline value
* Completed and pending activities
* Lead source analysis
* Lead status distribution
* Customer segmentation
* Activity breakdown
* Pipeline visualization

### 🤖 AI Copilot

SmartCRM AI includes an AI assistant powered by **Google Gemini**.

The AI Copilot provides a conversational interface that can be extended for CRM-focused assistance such as:

* CRM data assistance
* Sales workflow support
* Lead-related analysis
* Customer-related assistance
* Natural-language interaction

The AI integration is implemented through the Spring Boot backend rather than exposing API credentials to the frontend.

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login and registration
* Role-based authorization
* Protected REST APIs
* Admin-only operations
* Sales manager permissions
* Sales representative permissions

Supported roles:

| Role                   | Description                               |
| ---------------------- | ----------------------------------------- |
| `ADMIN`                | Full system administration and management |
| `SALES_MANAGER`        | Sales and CRM management capabilities     |
| `SALES_REPRESENTATIVE` | Customer, lead, and activity management   |

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                            |
| ------------ | ---------------------------------- |
| React 19     | User interface                     |
| Vite         | Frontend development/build tooling |
| React Router | Client-side routing                |
| Material UI  | UI components and styling          |
| Axios        | REST API communication             |
| Recharts     | Analytics and data visualization   |
| FullCalendar | Calendar interface                 |

### Backend

| Technology      | Purpose                          |
| --------------- | -------------------------------- |
| Java 17         | Backend programming language     |
| Spring Boot     | Backend framework                |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database access                  |
| Hibernate       | ORM                              |
| Maven           | Dependency management and build  |
| JWT             | Authentication tokens            |

### Database

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| MySQL 8       | Relational database       |
| JPA/Hibernate | Object-relational mapping |

### AI

| Technology        | Purpose                |
| ----------------- | ---------------------- |
| Google Gemini API | Generative AI          |
| Gemini 2.5 Flash  | AI Copilot model       |
| Google GenAI SDK  | Backend AI integration |

---

## 🏗️ Architecture

SmartCRM AI follows a layered full-stack architecture.

```text
┌─────────────────────────────────────────────┐
│                  React UI                   │
│                                             │
│ Dashboard │ Customers │ Leads │ Analytics   │
│ Calendar  │ Documents │ AI Copilot │ etc.  │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API / Axios
                       ▼
┌─────────────────────────────────────────────┐
│              Spring Boot API                │
│                                             │
│ Controllers → Services → Repositories       │
│                                             │
│ JWT Authentication                          │
│ Role-Based Authorization                    │
│ Validation & Exception Handling             │
└──────────────────────┬──────────────────────┘
                       │
                       │ JPA / Hibernate
                       ▼
┌─────────────────────────────────────────────┐
│                   MySQL                     │
│                                             │
│ Users │ Customers │ Leads │ Activities      │
│ Documents │ CRM Data │ Analytics Data       │
└─────────────────────────────────────────────┘

                       │
                       │ AI Requests
                       ▼
              ┌─────────────────┐
              │  Google Gemini  │
              │   AI Copilot    │
              └─────────────────┘
```

---

## 📂 Project Structure

```text
SmartCRM-AI/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── smartcrm/
│   │       │           ├── config/
│   │       │           ├── controller/
│   │       │           ├── dto/
│   │       │           ├── entity/
│   │       │           ├── repository/
│   │       │           ├── security/
│   │       │           └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 🔐 Security

SmartCRM AI uses several security mechanisms:

* JWT authentication
* Protected API endpoints
* Role-based authorization
* Password hashing
* CORS configuration
* Backend-controlled AI API access
* Environment variables for sensitive credentials
* Git exclusion of environment files and generated data

> **Never commit your Gemini API key, database password, JWT secret, or other credentials to GitHub.**

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js
* npm
* MySQL 8+
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/777Ishaan/SmartCRM-AI.git
cd SmartCRM-AI
```

---

## 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE smartcrm;
```

Then configure your backend database connection in:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartcrm
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Use your own local MySQL credentials.

---

## 3. Configure Gemini AI

Create a Gemini API key through **Google AI Studio**.

Set the API key as an environment variable rather than placing it directly in source code.

### Windows PowerShell

```powershell
$env:GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
```

Then start the backend.

> Never commit the API key to GitHub.

---

## 4. Start the Backend

Open a terminal:

```powershell
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## 5. Start the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🔑 Authentication

After starting the application, create an account through the registration endpoint or the application's authentication flow.

The application uses JWT tokens for authenticated API requests.

Protected requests include the JWT token using:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 📊 Main Modules

```text
SmartCRM AI
│
├── 🔐 Authentication
│
├── 📊 Dashboard
│
├── 👥 Customers
│
├── 🎯 Leads
│
├── 📋 Activities
│
├── 📅 Calendar
│
├── 📁 Documents
│
├── 📈 Analytics
│
├── 🤖 AI Copilot
│
├── 👤 User Management
│
└── ⚙️ Settings
```

---

## 🧠 AI Integration

The AI Copilot follows a backend-mediated architecture:

```text
React AI Copilot
       │
       │ POST /api/ai/chat
       ▼
Spring Boot AI Controller
       │
       ▼
AI Service
       │
       ▼
Google Gemini API
       │
       ▼
AI Response
       │
       ▼
React Chat Interface
```

This keeps the Gemini API credential on the backend rather than exposing it in the browser.

---

## 📈 Analytics

The analytics module retrieves CRM data from MySQL through the Spring Boot API and visualizes it using Recharts.

Current analytics include:

* Total customers
* Total leads
* Pipeline value
* Completed activities
* Pending activities
* Lead sources
* Lead statuses
* Customer segmentation
* Activity types
* Pipeline by lead status

---

## 🎨 UI & UX

The frontend uses Material UI with a responsive dark-themed interface.

Key UI characteristics:

* Responsive dashboard layout
* Persistent sidebar navigation
* Top navigation bar
* Dark theme
* Data cards
* Interactive charts
* Tables and dialogs
* Form validation
* Loading states
* AI chat interface

---

## 🔮 Future Improvements

Potential future enhancements include:

* Advanced AI lead scoring
* Deal closure probability prediction
* Automated meeting summaries
* Customer sentiment analysis
* AI-generated sales insights
* Email integration
* AWS S3 document storage
* Advanced reporting
* Automated CRM notifications
* Real-time notifications
* Docker deployment
* CI/CD pipeline
* Production cloud deployment

---

## 🎯 Project Goals

SmartCRM AI was developed to demonstrate practical full-stack software engineering concepts, including:

* Building a complete React frontend
* Designing RESTful APIs
* Developing Spring Boot services
* Working with relational databases
* Implementing authentication and authorization
* Connecting frontend and backend systems
* Creating data-driven dashboards
* Integrating generative AI
* Managing file uploads
* Designing scalable application architecture

---

## 👨‍💻 Author

**Ishaan Sharma**

Computer Science Engineering Student

GitHub: [@777Ishaan](https://github.com/777Ishaan)

---

## 📄 License

This project is intended primarily as a portfolio and educational project.

If you plan to reuse, modify, or distribute the project, please contact the author or add an appropriate open-source license.

---

## ⭐ Acknowledgements

Built using open-source technologies and developer tools including:

* React
* Vite
* Material UI
* Spring Boot
* Spring Security
* Hibernate
* MySQL
* Recharts
* FullCalendar
* Google Gemini AI
* GitHub
