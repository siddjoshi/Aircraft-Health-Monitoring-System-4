#!/bin/bash

# Validate Kubernetes manifests for Aircraft Health Monitoring System
# This script checks the syntax and basic validation of all Kubernetes YAML files

set -e

echo "🔍 Validating Kubernetes manifests..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

# Directory containing Kubernetes manifests
K8S_DIR="k8s"

if [ ! -d "$K8S_DIR" ]; then
    echo "❌ Kubernetes manifests directory not found: $K8S_DIR"
    exit 1
fi

# Validate each YAML file
echo "📋 Validating YAML syntax..."
for yaml_file in $K8S_DIR/*.yaml; do
    if [ -f "$yaml_file" ]; then
        echo "  Checking $(basename $yaml_file)..."
        
        # Check YAML syntax using basic validation
        if ! python3 -c "import yaml; list(yaml.safe_load_all(open('$yaml_file')))" 2>/dev/null; then
            echo "    ❌ YAML syntax error in $yaml_file"
            python3 -c "import yaml; list(yaml.safe_load_all(open('$yaml_file')))"
            exit 1
        else
            echo "    ✅ Valid YAML syntax"
        fi
        
        # Check for common issues
        if grep -q "your-acr-name" "$yaml_file"; then
            echo "    ⚠️  Warning: Contains placeholder 'your-acr-name' - needs to be replaced"
        fi
        
        if grep -q "example.com" "$yaml_file"; then
            echo "    ⚠️  Warning: Contains placeholder 'example.com' - needs to be replaced"
        fi
    fi
done

echo ""
echo "🔧 Checking Docker Compose..."
if [ -f "docker-compose.yml" ]; then
    if command -v docker-compose &> /dev/null; then
        if docker-compose config > /dev/null 2>&1; then
            echo "  ✅ Docker Compose configuration is valid"
        else
            echo "  ❌ Docker Compose configuration has errors"
            docker-compose config
            exit 1
        fi
    else
        echo "  ⚠️  docker-compose not installed, skipping validation"
    fi
else
    echo "  ❌ docker-compose.yml not found"
fi

echo ""
echo "📊 Manifest Summary:"
echo "  Backend deployment: $([ -f "$K8S_DIR/backend.yaml" ] && echo "✅" || echo "❌")"
echo "  Frontend deployment: $([ -f "$K8S_DIR/frontend.yaml" ] && echo "✅" || echo "❌")"
echo "  Ingress configuration: $([ -f "$K8S_DIR/ingress.yaml" ] && echo "✅" || echo "❌")"
echo "  ConfigMap: $([ -f "$K8S_DIR/configmap.yaml" ] && echo "✅" || echo "❌")"
echo "  HPA configuration: $([ -f "$K8S_DIR/hpa.yaml" ] && echo "✅" || echo "❌")"
echo "  Network policies: $([ -f "$K8S_DIR/network-policy.yaml" ] && echo "✅" || echo "❌")"

echo ""
echo "✅ All Kubernetes manifests validated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Replace placeholder values (ACR name, domain, etc.)"
echo "2. Update image tags to point to your container registry"
echo "3. Configure ingress hostname for your domain"
echo "4. Test deployment with: kubectl apply --dry-run=server -f k8s/"
echo "5. Deploy with: ./scripts/deploy-to-aks.sh"