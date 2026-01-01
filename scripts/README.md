# Utility Scripts

This directory contains utility scripts for the Node.js Master Course repository.

## Available Scripts

(Scripts will be added as needed for development and operations)

### Planned Scripts

- **setup.sh** - Initial setup script for new developers
- **start-all.sh** - Start all services locally
- **clean.sh** - Clean build artifacts and temporary files
- **test-all.sh** - Run tests across all services
- **deploy.sh** - Deployment automation
- **backup.sh** - Backup databases
- **seed-data.sh** - Seed development data

## Usage

Make scripts executable:

```bash
chmod +x scripts/*.sh
```

Run a script:

```bash
./scripts/setup.sh
```

## Creating Scripts

When creating new scripts:
1. Add shebang line (#!/bin/bash or #!/usr/bin/env node)
2. Make executable with chmod +x
3. Add documentation header
4. Include error handling
5. Update this README
