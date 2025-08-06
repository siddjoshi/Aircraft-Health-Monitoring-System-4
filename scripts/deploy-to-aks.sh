#!/bin/bash

# Build and Deploy Aircraft Health Monitoring System to AKS
# Prerequisites: 
# - Docker installed and configured
# - Azure CLI installed and logged in
# - kubectl configured for your AKS cluster
# - Azure Container Registry created

set -e

# Configuration
ACR_NAME="${ACR_NAME:-your-acr-name}"
RESOURCE_GROUP="${RESOURCE_GROUP:-your-resource-group}"
AKS_CLUSTER_NAME="${AKS_CLUSTER_NAME:-your-aks-cluster}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "🚀 Starting deployment to AKS..."

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it first."
    exit 1
fi

# Login to Azure Container Registry
echo "🔑 Logging into Azure Container Registry..."
az acr login --name $ACR_NAME

# Build and push backend image
echo "🏗️  Building backend image..."
docker build -t $ACR_NAME.azurecr.io/aircraft-monitoring-backend:$IMAGE_TAG ./backend

echo "📤 Pushing backend image to ACR..."
docker push $ACR_NAME.azurecr.io/aircraft-monitoring-backend:$IMAGE_TAG

# Build and push frontend image
echo "🏗️  Building frontend image..."
docker build -t $ACR_NAME.azurecr.io/aircraft-monitoring-frontend:$IMAGE_TAG ./frontend

echo "📤 Pushing frontend image to ACR..."
docker push $ACR_NAME.azurecr.io/aircraft-monitoring-frontend:$IMAGE_TAG

# Update Kubernetes manifests with ACR image names
echo "📝 Updating Kubernetes manifests..."
sed -i "s|aircraft-monitoring-backend:latest|$ACR_NAME.azurecr.io/aircraft-monitoring-backend:$IMAGE_TAG|g" k8s/backend.yaml
sed -i "s|aircraft-monitoring-frontend:latest|$ACR_NAME.azurecr.io/aircraft-monitoring-frontend:$IMAGE_TAG|g" k8s/frontend.yaml

# Get AKS credentials
echo "🔐 Getting AKS credentials..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME --overwrite-existing

# Deploy to AKS
echo "🚢 Deploying to AKS..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Deploy optional production features
echo "📊 Deploying autoscaling and network policies..."
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/network-policy.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/backend-deployment
kubectl rollout status deployment/frontend-deployment

# Get service information
echo "📊 Getting service information..."
kubectl get services
kubectl get ingress

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your DNS to point to the ingress IP address"
echo "2. Monitor the application with: kubectl get pods"
echo "3. View logs with: kubectl logs -f deployment/backend-deployment"
echo "4. Access the application at: http://your-domain.com"