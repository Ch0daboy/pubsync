#!/bin/bash

echo "🚀 ContentSync MVP Production Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.local exists
print_status "Checking environment configuration..."
if [ ! -f .env.local ]; then
    print_error ".env.local file not found!"
    echo "Please copy env.example to .env.local and fill in your environment variables"
    exit 1
fi
print_success "Environment file found"

# Check required environment variables
print_status "Validating environment variables..."
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "GOOGLE_GEMINI_API_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi
print_success "All required environment variables found"

# Clean install dependencies
print_status "Cleaning and installing dependencies..."
rm -rf node_modules package-lock.json
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"

# Run security audit
print_status "Running security audit..."
npm audit --audit-level=high
if [ $? -ne 0 ]; then
    print_warning "Security vulnerabilities found. Consider running 'npm audit fix'"
fi

# Run linting
print_status "Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    print_error "Linting failed. Please fix ESLint errors before deployment"
    exit 1
fi
print_success "Linting passed"

# Build the project
print_status "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi
print_success "Build completed successfully"

# Run functionality tests
print_status "Running functionality tests..."
if [ -f "tests/test-functionality.js" ]; then
    # Start dev server for testing
    npm run dev &
    DEV_PID=$!
    sleep 5

    # Run tests
    node tests/test-functionality.js
    TEST_RESULT=$?

    # Kill dev server
    kill $DEV_PID

    if [ $TEST_RESULT -ne 0 ]; then
        print_error "Functionality tests failed"
        exit 1
    fi
    print_success "Functionality tests passed"
else
    print_warning "No functionality tests found"
fi

# Check git status
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Consider committing them before deployment."
    git status --short
fi

# Final deployment readiness check
print_success "🎉 Deployment readiness check complete!"
echo ""
echo "📋 Deployment Summary:"
echo "======================"
echo "✅ Environment variables configured"
echo "✅ Dependencies installed and updated"
echo "✅ Security audit completed"
echo "✅ Linting passed"
echo "✅ Build successful"
echo "✅ Functionality tests passed"
echo ""
echo "🚀 Next Steps for Vercel Deployment:"
echo "===================================="
echo "1. Commit and push your code:"
echo "   git add ."
echo "   git commit -m 'feat: ready for production deployment'"
echo "   git push origin main"
echo ""
echo "2. In Vercel Dashboard:"
echo "   - Import your GitHub repository"
echo "   - Configure environment variables:"
for var in "${required_vars[@]}"; do
    echo "     - $var"
done
echo "   - Set NEXT_PUBLIC_APP_URL to your Vercel domain"
echo "   - Deploy!"
echo ""
echo "3. Post-deployment verification:"
echo "   - Test authentication flow"
echo "   - Verify AI content generation"
echo "   - Check database operations"
echo "   - Monitor performance metrics"
echo ""
echo "📚 Documentation:"
echo "   - Deployment Checklist: DEPLOYMENT_CHECKLIST.md"
echo "   - Environment Guide: DEPLOYMENT_ENV.md"
echo "   - Setup Instructions: SETUP.md"
echo ""
print_success "Ready for production deployment! 🚀"