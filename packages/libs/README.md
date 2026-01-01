# Shared Libraries

This directory contains shared libraries and utilities used across multiple services.

## Purpose

Shared libraries help:
- Reduce code duplication
- Ensure consistent behavior
- Simplify maintenance
- Enable code reuse

## Planned Libraries

### Logger
A standardized logging library for all services:
- Structured logging (JSON)
- Log levels (debug, info, warn, error)
- Request ID tracking
- Integration with log aggregation systems

### Utils
Common utility functions:
- Data validation
- Date/time helpers
- String manipulation
- Encryption/decryption helpers
- Configuration management

### Database
Database connection and ORM utilities:
- Connection pooling
- Query builders
- Migration helpers
- Transaction management

### Auth
Shared authentication utilities:
- JWT token validation
- Auth middleware
- Permission checking
- Session management

### HTTP Client
Standardized HTTP client for inter-service communication:
- Retry logic
- Circuit breaker
- Request/response logging
- Error handling

## Creating a Library

1. Create directory under `packages/libs/`
2. Add package.json:
```json
{
  "name": "@nodejs-course/library-name",
  "version": "1.0.0",
  "main": "index.js",
  "private": true
}
```
3. Implement the library
4. Export public API via index.js
5. Add README with usage examples
6. Add tests

## Using Libraries in Services

Since this is a monorepo with npm workspaces:

```json
{
  "dependencies": {
    "@nodejs-course/logger": "*"
  }
}
```

Then import:
```javascript
const logger = require('@nodejs-course/logger');
```

## Best Practices

- Keep libraries focused and single-purpose
- Document all public APIs
- Include TypeScript types
- Write comprehensive tests
- Version carefully
- Avoid external dependencies when possible
