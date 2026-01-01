# Kubernetes Manifests

This directory will contain Kubernetes deployment manifests for the Node.js Master Course services.

## Structure

Kubernetes manifests will be organized by resource type and service:

```
k8s/
├── namespace.yaml              # Course namespace
├── configmaps/                 # Configuration
├── secrets/                    # Sensitive data
├── services/                   # Service definitions
├── deployments/                # Deployment specs
├── ingress/                    # Ingress rules
└── monitoring/                 # Monitoring resources
```

## Usage

Deploy to cluster:

```bash
kubectl apply -f k8s/
```

## Coming Soon

Manifests for:
- Service deployments
- Database stateful sets
- Load balancers
- Auto-scaling configurations
- Resource limits and requests
