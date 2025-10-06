# Airgead - Secure Finance App

A full-stack financial ledger application for securely tracking and managing personal finances — built with Java Spring Boot (API) and React/Vite (UI components created with AI assistance), containerized with Docker, and deployed to the cloud on Microsoft Azure (VM + PostgreSQL) with NGINX reverse proxy and HTTPS enabled via Let’s Encrypt.

This project demonstrates my ability to build, containerize, and deploy secure, production-ready applications with modern backend and cloud infrastructure practices.

**Live Demo**: [https://airgead.io](https://airgead.io)

---

## Why This Project?

This app showcases my ability to:

- Build secure, production-grade REST APIs with Spring Boot  
- Design responsive UI components (React/Vite frontend created with AI assistance)
- Implement JWT authentication for secure user sessions  
- Configure HTTPS and reverse proxying with NGINX and Let’s Encrypt  
- Manage containerized deployments via Docker and Docker Compose  
- Deploy and scale applications on Microsoft Azure with PostgreSQL as a managed database  

I built this project as part of my portfolio to demonstrate **end-to-end backend, frontend, and deployment skills**.

---

## Features

- Secure user authentication with JWT tokens  
- RESTful API built with Spring Boot  
- PostgreSQL database hosted on Azure  
- Responsive frontend built with React and Tailwind CSS (AI-assisted) 
- HTTPS enabled via Let’s Encrypt SSL certificates  
- NGINX reverse proxy for routing frontend/backend traffic in production  
- Environment-based configuration for local and cloud deployments  
- Cloud deployment on Microsoft Azure VM with PostgreSQL Azure Database  

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Backend      | Java, Spring Boot                 |
| Frontend     | React, Vite, Tailwind CSS         |
| Database     | PostgreSQL (Azure Database)       |
| Auth         | JWT                               |
| Security     | HTTPS via Let’s Encrypt           |
| Cloud        | Microsoft Azure (VM + PostgreSQL) |
| Reverse Proxy| NGINX                             |
| DevOps       | Docker, Docker Compose            |

---

## Project Structure

```
├── backend
│ ├── Dockerfile.local
│ ├── Dockerfile.production
│ └── demo.jar
├── docker-compose.local.yml
├── frontend
│ ├── src
│ │ ├── api.js # Frontend API calls
│ │ ├── pages
│ │ │ ├── Dashboard.jsx # Finance dashboard UI
│ │ │ └── LoginPage.jsx # Authentication UI
│ │ └── App.jsx
│ └── package.json
├── pom.xml # Maven dependencies
└── src
└── main
├── java/com/example/finance
│ ├── FinanceApplication.java
│ ├── config/WebConfig.java
│ ├── controller # REST controllers
│ ├── dto # Request/response DTOs
│ ├── model # Entity models
│ ├── repository # Spring Data JPA repositories
│ ├── security # JWT + Security config
│ └── service # Business logic
└── resources
└── application.properties
```
---

## Getting Started (Local Development)

### Prerequisites

- Docker & Docker Compose installed  
- Git installed  

### Setup

```bash
git clone https://github.com/Stiofain-MacMathuna/airgead.git
cd springboot-finance-app
docker compose -f docker-compose.local.yml up --build
```

The app will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Cloud Deployment

The production version of this app is deployed on:

- **Microsoft Azure VM** — Hosts the Dockerized backend and frontend
- **Azure Database for PostgreSQL** — Manages the database
- **NGINX reverse proxy** — Routes traffic to frontend/backend and enforces HTTPS
- **Let’s Encrypt** — Provides SSL certificates for HTTPS

---

## Deployment Highlights

- Spring Boot backend and React frontend containerized with Docker
- Deployed on **Azure VM** with NGINX reverse proxy
- Database hosted on **Azure Database for PostgreSQL**
- HTTPS configured using **Let’s Encrypt certificates**
- Secure authentication via **JWT tokens**
- Environment variables managed via `.env` files for dev/prod

---

## Future Work

- **Testing**: Unit and integration testing with JUnit & Spring Boot Test planned for future iterations.

---
