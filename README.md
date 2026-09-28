Fintrox 💰

## Multi-Role Loan & Finance Management Platform

Fintrox is a full-stack loan and finance management platform designed for small lending businesses and field collection teams.

It provides a centralized platform for managing customers, loans, collections, employees, lenders, routes, reports, and business performance.

The application is built around three major user roles — **Owner, Employee/Field Agent, and Lender** — with role-specific permissions and workflows.

---

## 🌐 Live Demo

🚀 **Live Application:**  
https://fintrox.vercel.app

💻 **GitHub Repository:**  
https://github.com/PravinJP/Fintrox

> **Note:** The backend is hosted on Render's free tier. If the service has been inactive, the first request may take a little longer while the backend starts.

---

## 🎯 Why Fintrox?

Small lending businesses often rely on spreadsheets, notebooks, and messaging applications to manage:

- Customers
- Loans
- Installments
- Daily collections
- Employees
- Field agents
- Outstanding amounts
- Payment records
- Business reports

Fintrox brings these workflows into a single centralized system with role-based access, automated loan calculations, collection management, reporting, and analytics.

---

# ✨ Key Features

## 👥 Multi-Role Architecture

Fintrox supports three major roles, each with different responsibilities and permissions.

### 👨‍💼 Owner

The Owner has access to the overall lending operation.

- Manage customers
- Manage employees
- Manage lenders
- Create and manage loans
- Monitor collections
- View business analytics
- Track employee performance
- Manage routes
- Generate reports

### 👨‍💻 Employee / Field Agent

Employees can manage their assigned field operations.

- View assigned customers
- Record collections
- Manage collection activities
- View assigned routes
- Generate payment receipts
- Track collection performance
- View relevant loan information

### 💰 Lender

Lenders can monitor their lending activities.

- View customers
- View loans
- Monitor loan status
- Track collections
- View lending-related information
- Monitor outstanding amounts

Role-based authorization ensures that each user can access only the functionality relevant to their role.

---

# 💰 Loan Management

Fintrox supports multiple loan repayment frequencies.

### Supported Loan Types

- Daily
- Weekly
- Monthly

### Loan Features

- Automatic interest calculation
- Automatic installment schedule generation
- Loan status tracking
- Outstanding amount calculation
- Installment tracking
- Customer loan history
- Collection tracking

---

# 📍 Collection Management

Fintrox is designed to support field-based collection operations.

### Features

- Record daily collections
- Track employee collections
- Assign collection routes
- Monitor collection performance
- Track customer payments
- Generate payment receipts
- View collection history

---

# 🛣️ Route Management

The platform includes route management for field employees.

- Assign collection routes
- Manage employee routes
- Organize field activities
- Track assigned customers
- Support field collection workflows

---

# 📊 Dashboard & Analytics

Role-specific dashboards provide relevant information based on the logged-in user.

### Dashboard Information

- Today's collections
- Weekly collections
- Monthly collections
- Total outstanding amount
- Active loans
- Employee statistics
- Collection performance
- Recent collections
- Business activity

---

# 📄 Reports & Documents

Fintrox provides downloadable reports and documents.

### Supported Reports

- Excel reports
- PDF reports
- Payment receipts
- Loan reports
- Collection reports
- Performance reports

---

# 🔐 Authentication & Security

Security is implemented using **Spring Security and JWT**.

### Security Features

- JWT authentication
- Role-Based Access Control (RBAC)
- BCrypt password hashing
- Protected REST APIs
- Stateless authentication
- Authentication filters
- Forgot password functionality
- Password reset through email

---

# 📧 Forgot Password & Email Integration

Fintrox includes a complete forgot-password workflow.

For email delivery, instead of relying on traditional SMTP, the application uses the **Brevo HTTP API** through an HTTP client.

This approach was chosen to work reliably with the deployed hosting environment.

### Password Reset Flow

```text
User requests password reset
            ↓
Backend validates email
            ↓
Reset token generated
            ↓
Password reset link created
            ↓
Brevo HTTP API
            ↓
Email delivered to user
            ↓
User resets password


---

⚡ Redis Caching

Redis is used to cache frequently accessed data and improve backend performance.

Benefits

Reduced repeated database queries

Faster API responses

Reduced database load

Improved dashboard performance

Better response times for frequently accessed data



---

🧠 More Than Basic CRUD

Fintrox was designed to go beyond a simple CRUD application.

The platform contains business workflows such as:

Automated interest calculations

Installment schedule generation

Multi-role authorization

Collection management

Route assignments

Employee performance tracking

Payment receipt generation

Excel/PDF reporting

Redis caching

Email integration

Production deployment

Backend monitoring


The modules are connected through actual lending workflows rather than functioning as isolated CRUD screens.


---

🎨 UI/UX

The UI/UX was designed with a focus on creating a practical finance-management experience.

Google Stitch was used during the UI/UX design process to explore interface concepts and user flows.

The final frontend was implemented using:

React

TypeScript

Tailwind CSS


The interface includes role-specific dashboards, forms, tables, reports, collection workflows, and loan management screens.


---

🏗️ System Architecture

Fintrox
                            │
             ┌──────────────┴──────────────┐
             │                             │
        React Frontend                Spring Boot
        TypeScript                    Backend API
        Tailwind CSS                       │
             │                             │
             │ REST APIs                   │
             └──────────────►──────────────┤
                                           │
                          ┌────────────────┼────────────────┐
                          │                │                │
                          ▼                ▼                ▼
                    PostgreSQL          Redis          Brevo API
                       Neon             Render         Email Service


---

🛠️ Technology Stack

Backend

Java 21

Spring Boot

Spring Security

JWT

Hibernate

JPA

REST APIs

Maven


Frontend

React

TypeScript

Tailwind CSS

Axios


Database

PostgreSQL

Neon


Caching

Redis

Render


Email

Brevo HTTP API

HTTP Client


Deployment

Vercel

Render

Docker

GitHub


Monitoring

UptimeRobot


UI/UX

Google Stitch



---

📂 Backend Project Structure

The backend is organized into feature-based modules rather than keeping all controllers, services, and repositories in separate global folders.

Fintrox/
│
├── Auth/
│   └── Authentication & Authorization
│
├── collection/
│   └── Collection Management
│
├── common/
│   └── Shared Components & Utilities
│
├── config/
│   └── Application & Security Configuration
│
├── customer/
│   └── Customer Management
│
├── dashboard/
│   └── Dashboard & Analytics
│
├── employee/
│   └── Employee Management
│
├── loan/
│   └── Loan Management & Calculations
│
├── organization/
│   └── Organization / Tenant Management
│
├── reports/
│   └── Excel & PDF Reports
│
├── route/
│   └── Field Route Management
│
├── security/
│   └── JWT Security & Authentication Filters
│
└── FintroxApplication.java

Backend Module Overview

Module	Responsibility

Auth	Login, registration and password-related workflows
collection	Field collections and payment recording
common	Shared DTOs, responses and utilities
config	Application, CORS and security configuration
customer	Customer management
dashboard	Dashboard statistics and analytics
employee	Employee and field-agent management
loan	Loan creation, calculations and schedules
organization	Organization and business-level management
reports	Excel/PDF report generation
route	Collection route management
security	JWT authentication and security components



---

🔄 Application Workflow

A typical lending workflow looks like:

Owner
  │
  ├── Creates Customer
  │
  ├── Creates Loan
  │
  └── Assigns Employee / Route
          │
          ▼
     Employee / Agent
          │
          ├── Visits Customer
          │
          ├── Collects Payment
          │
          ├── Records Collection
          │
          └── Generates Receipt
                    │
                    ▼
                Dashboard
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Collection  Loan      Employee
       Updated   Updated   Performance


---

🔒 Authentication Flow

Fintrox uses JWT-based stateless authentication.

User Login
                     │
                     ▼
             Authentication API
                     │
                     ▼
             Credentials Verified
                     │
                     ▼
                JWT Token
                     │
                     ▼
            Frontend stores token
                     │
                     ▼
             API Request + JWT
                     │
                     ▼
          JwtAuthenticationFilter
                     │
                     ▼
             User Authenticated
                     │
                     ▼
          Role / Permission Check
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        OWNER     EMPLOYEE     LENDER


---

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

Java 21

Maven

Node.js 18+

npm

PostgreSQL

Redis

Git



---

⚙️ Backend Setup

Clone the repository:

git clone https://github.com/PravinJP/Fintrox.git

Navigate to the backend project:

cd Fintrox

Configure your environment variables.

Example:

DATABASE_URL=your_postgresql_url
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email

Run the application:

./mvnw spring-boot:run

Or using Maven:

mvn spring-boot:run

The backend will normally start on:

http://localhost:8080


---

🎨 Frontend Setup

Navigate to your frontend project:

cd frontend

Install dependencies:

npm install

Create a .env file:

VITE_API_URL=http://localhost:8080/api

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173


---

❤️ Health Monitoring

A lightweight public health endpoint is available for monitoring the backend:

GET /health

Production endpoint:

https://fintrox.onrender.com/health

The endpoint is monitored using UptimeRobot to periodically check backend availability and reduce the impact of Render's free-tier inactivity behavior.


---

☁️ Deployment

Frontend

Vercel

Backend

Render

Database

Neon PostgreSQL

Redis

Render Redis

Monitoring

UptimeRobot

Containerization

Docker


---

🐛 Production Challenges

One of the most valuable parts of developing Fintrox was dealing with issues that appeared after deployment.

Some of the challenges included:

CORS configuration between Vercel and Render

Production environment variables

Database connectivity

JWT authentication issues

Frontend/backend data mismatches

API errors that did not occur locally

Backend deployment and redeployment issues

Email delivery in the production environment

Render free-tier backend inactivity


These challenges provided practical experience with debugging, deployment, monitoring, and maintaining a full-stack application in a production environment.


---

📈 Future Improvements

Potential improvements for future versions include:

Mobile application for field agents

Advanced collection analytics

Automated payment reminders

Notifications

Improved route optimization

Enhanced audit logging

More advanced financial analytics

Additional reporting capabilities



---

👨‍💻 Author

Pravin J

Full Stack Developer | Java | Spring Boot | React | AI/ML

🔗 GitHub:
https://github.com/PravinJP


---

⭐ Feedback

If you find Fintrox interesting, feel free to explore the live application and source code.

Feedback, suggestions, and improvements are always welcome.

⭐ If you find the project useful, consider giving the repository a star!


---

📜 License

This project was developed for learning, portfolio, and demonstration purposes.
