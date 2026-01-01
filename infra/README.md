# Infrastructure

This directory contains infrastructure-as-code and deployment configurations for the Node.js Master Course.

## Docker Compose

### Starting Local Infrastructure

To start all infrastructure services locally:

```bash
docker compose up -d
```

### Services Included

- **PostgreSQL** (port 5432) - Relational database
- **Redis** (port 6379) - Caching and pub/sub
- **MongoDB** (port 27017) - NoSQL database
- **Kafka** (port 9092) - Message broker
- **Zookeeper** (port 2181) - Kafka coordination
- **Mailhog** (ports 1025, 8025) - Email testing

### Default Credentials

- **PostgreSQL/MongoDB**
  - Username: `courseuser`
  - Password: `coursepass`
  - Database: `nodejs_course`

### Accessing Services

- **Mailhog Web UI:** http://localhost:8025
- **PostgreSQL:** `psql -h localhost -U courseuser -d nodejs_course`
- **MongoDB:** `mongosh mongodb://courseuser:coursepass@localhost:27017`
- **Redis:** `redis-cli -h localhost -p 6379`

### Stopping Services

```bash
docker compose down
```

To remove volumes as well:

```bash
docker compose down -v
```

## Kubernetes

The `k8s/` directory will contain Kubernetes manifests for deploying services to a cluster.

### Structure (Coming Soon)

```
k8s/
├── namespace.yaml
├── services/
│   ├── auth-service.yaml
│   ├── backend-service.yaml
│   └── ...
├── databases/
│   ├── postgres.yaml
│   └── redis.yaml
└── ingress/
    └── ingress.yaml
```

## Cloud Deployment

Instructions for deploying to various cloud providers:

- AWS (ECS, EKS, Lambda)
- Google Cloud (GKE, Cloud Run)
- Azure (AKS, Container Instances)

(To be added as course modules are developed)

## Monitoring & Observability

Future additions:

- Prometheus for metrics
- Grafana for dashboards
- Jaeger for distributed tracing
- ELK stack for logging
