# AKS Deployment Guide

This guide explains how to deploy the Aircraft Health Monitoring System to Azure Kubernetes Service (AKS).

## Prerequisites

1. **Azure CLI** - Install and configure Azure CLI
2. **kubectl** - Kubernetes command-line tool
3. **Docker** - For building container images
4. **Azure Container Registry (ACR)** - For storing container images
5. **AKS Cluster** - Running Azure Kubernetes Service cluster

## Setup Instructions

### 1. Create Azure Resources

```bash
# Set variables
export RESOURCE_GROUP="aircraft-monitoring-rg"
export LOCATION="eastus"
export ACR_NAME="aircraftmonitoringacr"
export AKS_CLUSTER_NAME="aircraft-monitoring-aks"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Create AKS cluster
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER_NAME \
  --node-count 2 \
  --enable-addons monitoring \
  --attach-acr $ACR_NAME \
  --generate-ssh-keys
```

### 2. Build and Push Images

```bash
# Login to ACR
az acr login --name $ACR_NAME

# Build and push backend image
docker build -t $ACR_NAME.azurecr.io/aircraft-monitoring-backend:latest ./backend
docker push $ACR_NAME.azurecr.io/aircraft-monitoring-backend:latest

# Build and push frontend image
docker build -t $ACR_NAME.azurecr.io/aircraft-monitoring-frontend:latest ./frontend
docker push $ACR_NAME.azurecr.io/aircraft-monitoring-frontend:latest
```

### 3. Update Kubernetes Manifests

Update the image names in `k8s/backend.yaml` and `k8s/frontend.yaml` to point to your ACR:

```yaml
# In k8s/backend.yaml
image: your-acr-name.azurecr.io/aircraft-monitoring-backend:latest

# In k8s/frontend.yaml
image: your-acr-name.azurecr.io/aircraft-monitoring-frontend:latest
```

### 4. Deploy to AKS

```bash
# Get AKS credentials
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME

# Deploy applications
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get pods
kubectl get services
kubectl get ingress
```

### 5. Configure Ingress (Optional)

If using Application Gateway Ingress Controller:

```bash
# Install AGIC
az aks enable-addons \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER_NAME \
  --addons ingress-appgw \
  --appgw-name aircraft-monitoring-appgw \
  --appgw-subnet-cidr "10.225.0.0/16"
```

## Automated Deployment

Use the provided script for automated deployment:

```bash
# Set environment variables
export ACR_NAME="your-acr-name"
export RESOURCE_GROUP="your-resource-group"
export AKS_CLUSTER_NAME="your-aks-cluster"

# Run deployment script
./scripts/deploy-to-aks.sh
```

## Local Testing

Test the application locally using Docker Compose:

```bash
# Start local environment
./scripts/local-dev.sh

# Access the application
open http://localhost:3000
```

## Monitoring and Troubleshooting

### Check Pod Status
```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Check Services
```bash
kubectl get services
kubectl describe service <service-name>
```

### Check Ingress
```bash
kubectl get ingress
kubectl describe ingress aircraft-monitoring-ingress
```

### Scale Applications
```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=3

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3
```

## Architecture

The deployment consists of:

- **Backend Deployment**: Java Spring Boot application (2 replicas)
- **Frontend Deployment**: React application served by Nginx (2 replicas)
- **Backend Service**: ClusterIP service for internal communication
- **Frontend Service**: ClusterIP service for frontend pods
- **Ingress**: Application Gateway or NGINX ingress for external access

## Security Considerations

1. **Image Security**: Use ACR with image scanning enabled
2. **Network Policies**: Implement Kubernetes network policies
3. **RBAC**: Configure role-based access control
4. **Secrets**: Use Azure Key Vault for sensitive data
5. **TLS**: Enable TLS/SSL for production deployments

## Cost Optimization

1. **Node Pools**: Use appropriate VM sizes for your workload
2. **Auto-scaling**: Enable cluster autoscaler
3. **Resource Limits**: Set appropriate resource requests and limits
4. **Spot Instances**: Consider using spot node pools for non-production

## Production Readiness Checklist

- [ ] Configure resource limits and requests
- [ ] Set up health checks and probes
- [ ] Configure horizontal pod autoscaling
- [ ] Set up monitoring and alerting
- [ ] Implement backup and disaster recovery
- [ ] Configure TLS/SSL certificates
- [ ] Set up CI/CD pipeline
- [ ] Implement security scanning
- [ ] Configure log aggregation
- [ ] Set up database persistence (if needed)