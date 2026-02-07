# 30 — Kubernetes & Cloud Marketplaces

> Deploy HeadySystems to production Kubernetes clusters or cloud marketplaces.

## What's Here

- **Kubernetes manifests** (Deployment, Service, Ingress)
- **Helm chart** notes (future)
- **Cloud marketplace** listing guidance

## Kubernetes Manifests

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: heady-manager
  labels:
    app: heady-manager
spec:
  replicas: 2
  selector:
    matchLabels:
      app: heady-manager
  template:
    metadata:
      labels:
        app: heady-manager
    spec:
      containers:
        - name: heady-manager
          image: ghcr.io/headysystems/heady:latest
          ports:
            - containerPort: 3300
          envFrom:
            - secretRef:
                name: heady-secrets
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3300
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3300
            initialDelaySeconds: 5
            periodSeconds: 10
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: heady-manager
spec:
  selector:
    app: heady-manager
  ports:
    - port: 80
      targetPort: 3300
  type: ClusterIP
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: heady-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: heady.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: heady-manager
                port:
                  number: 80
```

## Cloud Marketplace Notes

| Platform | Status | Notes |
|---|---|---|
| AWS Marketplace | Planned | AMI or container listing |
| GCP Marketplace | Planned | GKE-ready container |
| Azure Marketplace | Planned | AKS-compatible |
| Render Blueprint | Active | `render.yaml` in repo root |

## Email Template

**Subject:** Deploy HeadySystems to Your Kubernetes Cluster

**Body:**

> Hi [Name],
>
> Attached are Kubernetes manifests to deploy HeadySystems to your cluster:
> - Deployment (2 replicas, health checks)
> - Service (ClusterIP)
> - Ingress (customize your domain)
>
> Apply with: `kubectl apply -f heady-k8s/`
>
> We also have a Render Blueprint for one-click cloud deploy.
>
> — Heady Team
