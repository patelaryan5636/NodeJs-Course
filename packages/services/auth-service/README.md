# Auth Service

Authentication and authorization service with JWT token management.

## Features

- User registration and login
- JWT token generation and validation
- Refresh token support (Auth-server.js)
- Role-based access control
- Token blacklisting
- Simple authentication (Server.js)
- Advanced authentication with refresh tokens (Auth-server.js)

## Files

- **Server.js** - Simple JWT authentication server
  - Basic user registration and login
  - JWT token generation
  - Protected routes with auth middleware
  - In-memory user storage
  - Port: 4000

- **Auth-server.js** - Advanced authentication server
  - Access token and refresh token pattern
  - Token expiration and renewal
  - Role-based authorization
  - Token blacklisting for logout
  - Port: 5000

## Running

### Simple Auth Server
```bash
node Server.js
```

### Advanced Auth Server
```bash
node Auth-server.js
```

## API Endpoints

### Simple Auth (Server.js)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user info (protected)

### Advanced Auth (Auth-server.js)
- `POST /signup` - Register new user
- `POST /login` - Login and get access + refresh tokens
- `POST /refresh` - Get new access token using refresh token
- `POST /logout` - Logout and blacklist token
- `GET /protected` - Example protected route
- `GET /admin` - Admin-only route

## Dependencies

- express
- jsonwebtoken
- bcryptjs

## Environment Variables

- `JWT_SECRET` - Secret key for signing tokens
- `PORT` - Server port (default: 4000 for Server.js, 5000 for Auth-server.js)

## Security Notes

- Use strong secrets in production
- Enable HTTPS in production
- Implement rate limiting
- Add input validation
- Consider using Redis for token blacklist in production
