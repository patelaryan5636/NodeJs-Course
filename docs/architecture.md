# Architecture Overview

## System Design

This Node.js Master Course repository follows a microservices architecture pattern, organized as a monorepo using npm workspaces.

## Directory Structure

```
repo-root/
├── README.md                    # Main course documentation
├── package.json                 # Root package with workspaces
├── .nvmrc                       # Node version specification
├── packages/
│   ├── services/                # Microservices
│   │   ├── auth-service/        # Authentication & authorization
│   │   ├── backend-service/     # Main backend service
│   │   ├── comment-service/     # Comments, ratings, likes
│   │   ├── live-service/        # Live streaming features
│   │   ├── map-service/         # Map search and location services
│   │   ├── newsletter-service/  # Newsletter management
│   │   ├── phone-service/       # Phone OTP verification
│   │   ├── realtime-service/    # Real-time communication
│   │   ├── chat-service/        # Chat functionality
│   │   ├── email-service/       # Email forwarding (SMTP)
│   │   ├── task-service/        # Task management
│   │   └── crud-service/        # Basic CRUD operations
│   └── libs/                    # Shared libraries
│       ├── logger/              # Logging utilities
│       └── utils/               # Common utilities
├── infra/                       # Infrastructure as code
│   ├── docker-compose.yml       # Local development setup
│   └── k8s/                     # Kubernetes manifests
├── docs/                        # Additional documentation
│   ├── architecture.md          # This file
│   └── runbooks/                # Operational runbooks
├── scripts/                     # Utility scripts
└── .github/workflows/           # CI/CD workflows
```

## Services Overview

### Auth Service
Handles user authentication with JWT tokens, including:
- Simple JWT authentication (Server.js)
- Advanced authentication with refresh tokens and role-based access (Auth-server.js)

### Backend Service
Main application backend with comprehensive API endpoints and file upload capabilities.

### Comment Service
Manages user interactions including:
- Comments API
- Comment ratings
- Like and subscribe functionality

### Live Service
Provides live streaming and real-time video capabilities.

### Map Service
Location-based services with search and nearby location features.

### Newsletter Service
Newsletter subscription and management system.

### Phone Service
OTP-based phone verification system.

### Realtime Service
WebSocket-based real-time communication features.

### Chat Service
Real-time chat server functionality.

### Email Service
SMTP email forwarding and notification services.

### Task Service
Task management and tracking API.

### CRUD Service
Basic create, read, update, delete operations template.

## Technology Stack

- **Runtime:** Node.js (LTS version specified in .nvmrc)
- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** multer
- **Real-time:** WebSockets, Socket.io

## Development Workflow

1. Use `nvm` to switch to the correct Node.js version: `nvm use`
2. Install dependencies: `npm install`
3. Navigate to specific services to run them
4. Follow the course modules in sequence as outlined in README.md

## Design Principles

- **Separation of Concerns:** Each service handles a specific domain
- **Modularity:** Services can be developed and deployed independently
- **Scalability:** Microservices architecture allows horizontal scaling
- **Maintainability:** Clear structure and organization
- **Educational:** Code is structured to demonstrate best practices

## Future Enhancements

- Add TypeScript support across all services
- Implement shared libraries for common functionality
- Add comprehensive testing infrastructure
- Implement API gateway
- Add monitoring and observability stack
- Create Docker containers for each service
- Add Kubernetes deployment manifests
