# Services

This directory contains all microservices for the Node.js Master Course.

## Available Services

### Authentication & Authorization
- **[auth-service](./auth-service/)** - User authentication with JWT tokens, refresh tokens, and RBAC

### Core Services
- **[backend-service](./backend-service/)** - Main backend with API endpoints and file uploads
- **[crud-service](./crud-service/)** - Template for basic CRUD operations

### Social & Interaction
- **[comment-service](./comment-service/)** - Comments, ratings, likes, and subscriptions
- **[chat-service](./chat-service/)** - Real-time chat with WebSocket support

### Communication
- **[realtime-service](./realtime-service/)** - Real-time updates and notifications
- **[email-service](./email-service/)** - SMTP email forwarding
- **[newsletter-service](./newsletter-service/)** - Newsletter subscriptions

### Media & Streaming
- **[live-service](./live-service/)** - Live streaming capabilities

### Utilities
- **[map-service](./map-service/)** - Location search and nearby features
- **[phone-service](./phone-service/)** - OTP-based phone verification
- **[task-service](./task-service/)** - Task management API

## Running Services

Each service can be run independently. Navigate to the service directory and run:

```bash
cd packages/services/[service-name]
node [main-file].js
```

## Service Structure

Each service directory contains:
- Service implementation files (.js)
- README.md with service documentation
- (Future) package.json for service-specific dependencies
- (Future) tests/
- (Future) Dockerfile

## Adding a New Service

1. Create directory under `packages/services/`
2. Add service implementation
3. Create README.md documenting the service
4. Add package.json if needed
5. Update this README with service info

## Common Patterns

All services follow these patterns:
- Express-based HTTP servers
- RESTful API design
- Environment variable configuration
- Middleware-based architecture
- Error handling

## Dependencies

Common dependencies across services:
- express - Web framework
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- multer - File uploads
- socket.io - WebSockets

## Development

For local development with all infrastructure:

```bash
# From repo root
cd ../../infra
docker compose up -d
```

This starts databases, caches, and other infrastructure services.
