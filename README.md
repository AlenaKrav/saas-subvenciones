# SaaS Subvenciones

A fullstack SaaS web application designed to help a grants department automate the generation of questionnaires based on public grant calls.

The application analyzes grant-call PDF documents using a Large Language Model (LLM) and generates structured questionnaires in DOCX format, reducing the manual work involved in reviewing and processing documentation.

## Overview

The application follows a decoupled architecture composed of a **React frontend**, a **Fastify backend**, and a REST API layer connecting the different services.

### Main workflow

1. The user authenticates through Microsoft Entra ID.
2. A grant-call PDF is uploaded through the web application.
3. The backend orchestrates the document processing pipeline.
4. The document is processed using an LLM running through Ollama.
5. The generated information is stored and the resulting questionnaire is generated as a DOCX document.
6. The user can access the processed result through the frontend.

## Architecture

```text
                    ┌─────────────────┐
                    │   React Frontend│
                    │ TanStack Router │
                    │  MSAL / Axios   │
                    └────────┬────────┘
                             │ REST API
                             │ JWT
                    ┌────────▼────────┐
                    │ Fastify Backend │
                    │    TypeScript   │
                    └───────┬─────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
        ┌─────▼─────┐ ┌────▼─────┐ ┌──────▼──────┐
        │ PostgreSQL│ │ Garage S3│ │   Ollama    │
        │  + Prisma │ │  Storage │ │     LLM     │
        └───────────┘ └──────────┘ └─────────────┘
```

### Frontend

The frontend is responsible for the user interface, navigation, authentication, route protection, forms, validation, and communication with the backend API.

* React
* TypeScript
* TanStack Router
* TanStack Form
* Tailwind CSS
* shadcn/ui
* Axios
* MSAL

### Backend

The backend centralizes the application's business logic and integrations with external services.

* Node.js
* Fastify
* TypeScript
* REST API
* Prisma ORM
* Zod
* TypeBox

### Authentication

Authentication is implemented using **Microsoft Entra ID** and MSAL.

The frontend obtains authentication tokens through MSAL, while the backend validates the received JWT tokens through authentication middleware. Axios interceptors are used to automatically include the authentication token in API requests.

### Document Processing

The application integrates **Ollama** to run LLMs and process grant-call documentation.

This allows the LLM processing to run on local infrastructure, providing greater control over the data and reducing dependency on external cloud-based AI services.

### Storage and Infrastructure

* PostgreSQL — persistent application data.
* Garage S3 — PDF and generated DOCX file storage.
* Docker — containerization and deployment.
* Linux / Ubuntu Server — server infrastructure.
* Tailscale — secure private communication between distributed services.

## Project Context

This application was developed during my professional experience at **DAYDE**, where I worked on the frontend, backend, authentication, API integrations, document-processing workflow, and infrastructure of the application.

The project provided practical experience in building a fullstack SaaS application, integrating authentication and external services, working with document-processing pipelines, and deploying distributed services in a Linux-based environment.
