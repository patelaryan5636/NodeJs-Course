# Packages

This directory contains all packages for the Node.js Master Course monorepo.

## Structure

```
packages/
├── services/          # Microservices
└── libs/             # Shared libraries
```

## Services

The `services/` directory contains independent microservices that can be deployed separately. Each service has its own:
- API endpoints
- Business logic
- Data models
- Dependencies

See [services/README.md](./services/README.md) for details.

## Libraries

The `libs/` directory contains shared code used across multiple services:
- Logging utilities
- Common helpers
- Shared types
- Database utilities

See [libs/README.md](./libs/README.md) for details.

## Monorepo Benefits

Using a monorepo structure provides:
- **Code Sharing:** Libraries can be shared easily
- **Consistent Tooling:** Same linters, formatters across all packages
- **Atomic Changes:** Update multiple services in one commit
- **Simplified Dependencies:** Shared dependency management
- **Unified CI/CD:** Single pipeline for all packages

## Workspace Management

This project uses npm workspaces. Install all dependencies:

```bash
npm install
```

Run commands in all workspaces:

```bash
npm test --workspaces
npm run build --workspaces
```

Run commands in specific workspace:

```bash
npm test --workspace=@nodejs-course/auth-service
```

## Adding New Packages

1. Create directory under `services/` or `libs/`
2. Add package.json with unique name
3. Workspaces will automatically detect it
4. Run `npm install` to link dependencies
