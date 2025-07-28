#!/bin/bash

echo "🔍 ContentSync MVP Production Verification"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if URL is provided
if [ -z "$1" ]; then
    print_error "Please provide the production URL"
    echo "Usage: ./scripts/verify-production.sh https://your-app.vercel.app"
    exit 1
fi

PROD_URL="$1"
print_status "Verifying production deployment at: $PROD_URL"

# Function to check HTTP status
check_endpoint() {
    local url="$1"
    local expected_status="$2"
    local description="$3"
    
    print_status "Checking $description..."
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$description - Status: $status_code"
        return 0
    else
        print_error "$description - Expected: $expected_status, Got: $status_code"
        return 1
    fi
}

# Function to check if page contains expected content
check_content() {
    local url="$1"
    local expected_text="$2"
    local description="$3"
    
    print_status "Checking $description content..."
    
    if curl -s "$url" | grep -q "$expected_text"; then
        print_success "$description - Content found"
        return 0
    else
        print_error "$description - Expected content not found"
        return 1
    fi
}

# Initialize counters
total_checks=0
passed_checks=0

# Test basic pages
echo ""
echo "📄 Testing Page Accessibility"
echo "============================="

pages=(
    "$PROD_URL:200:Homepage"
    "$PROD_URL/auth:200:Authentication Page"
    "$PROD_URL/content-gaps:200:Content Gaps Page"
    "$PROD_URL/repurpose:200:Repurpose Page"
    "$PROD_URL/review-queue:200:Review Queue Page"
    "$PROD_URL/settings:200:Settings Page"
)

for page in "${pages[@]}"; do
    IFS=':' read -r url status desc <<< "$page"
    total_checks=$((total_checks + 1))
    if check_endpoint "$url" "$status" "$desc"; then
        passed_checks=$((passed_checks + 1))
    fi
done

# Test API endpoints (should return 401 without auth)
echo ""
echo "🔌 Testing API Endpoints"
echo "========================"

api_endpoints=(
    "$PROD_URL/api/platforms:401:Platforms API"
    "$PROD_URL/api/repurpose:401:Repurpose API"
    "$PROD_URL/api/auth/callback:400:Auth Callback API"
)

for endpoint in "${api_endpoints[@]}"; do
    IFS=':' read -r url status desc <<< "$endpoint"
    total_checks=$((total_checks + 1))
    if check_endpoint "$url" "$status" "$desc"; then
        passed_checks=$((passed_checks + 1))
    fi
done

# Test content presence
echo ""
echo "📝 Testing Page Content"
echo "======================="

content_checks=(
    "$PROD_URL:ContentSync:Homepage Title"
    "$PROD_URL/auth:Sign in:Auth Page Content"
    "$PROD_URL/content-gaps:Content Opportunities:Content Gaps Title"
    "$PROD_URL/repurpose:AI Content Repurposer:Repurpose Title"
    "$PROD_URL/review-queue:Review Queue:Review Queue Title"
    "$PROD_URL/settings:Platform Settings:Settings Title"
)

for check in "${content_checks[@]}"; do
    IFS=':' read -r url text desc <<< "$check"
    total_checks=$((total_checks + 1))
    if check_content "$url" "$text" "$desc"; then
        passed_checks=$((passed_checks + 1))
    fi
done

# Test security headers
echo ""
echo "🔒 Testing Security Headers"
echo "==========================="

print_status "Checking security headers..."
headers_response=$(curl -s -I "$PROD_URL")

security_headers=(
    "X-Content-Type-Options"
    "X-Frame-Options"
    "X-XSS-Protection"
    "Referrer-Policy"
)

for header in "${security_headers[@]}"; do
    total_checks=$((total_checks + 1))
    if echo "$headers_response" | grep -qi "$header"; then
        print_success "Security header found: $header"
        passed_checks=$((passed_checks + 1))
    else
        print_warning "Security header missing: $header"
    fi
done

# Test HTTPS redirect
echo ""
echo "🔐 Testing HTTPS Enforcement"
echo "============================"

if [[ "$PROD_URL" == https://* ]]; then
    http_url="${PROD_URL/https:/http:}"
    total_checks=$((total_checks + 1))
    
    print_status "Checking HTTPS redirect..."
    redirect_status=$(curl -s -o /dev/null -w "%{http_code}" "$http_url")
    
    if [ "$redirect_status" = "301" ] || [ "$redirect_status" = "302" ] || [ "$redirect_status" = "308" ]; then
        print_success "HTTPS redirect working - Status: $redirect_status"
        passed_checks=$((passed_checks + 1))
    else
        print_warning "HTTPS redirect not detected - Status: $redirect_status"
    fi
else
    print_warning "Production URL is not HTTPS"
fi

# Performance check
echo ""
echo "⚡ Testing Performance"
echo "====================="

print_status "Checking page load time..."
total_checks=$((total_checks + 1))

load_time=$(curl -s -o /dev/null -w "%{time_total}" "$PROD_URL")
load_time_ms=$(echo "$load_time * 1000" | bc)

if (( $(echo "$load_time < 3.0" | bc -l) )); then
    print_success "Page load time: ${load_time_ms%.*}ms (Good)"
    passed_checks=$((passed_checks + 1))
elif (( $(echo "$load_time < 5.0" | bc -l) )); then
    print_warning "Page load time: ${load_time_ms%.*}ms (Acceptable)"
    passed_checks=$((passed_checks + 1))
else
    print_error "Page load time: ${load_time_ms%.*}ms (Slow)"
fi

# Final summary
echo ""
echo "📊 Verification Summary"
echo "======================="

success_rate=$(echo "scale=1; $passed_checks * 100 / $total_checks" | bc)

echo "Total Checks: $total_checks"
echo "Passed: $passed_checks"
echo "Failed: $((total_checks - passed_checks))"
echo "Success Rate: ${success_rate}%"

if [ "$passed_checks" -eq "$total_checks" ]; then
    print_success "🎉 All verification checks passed!"
    echo ""
    echo "✅ Your ContentSync MVP is successfully deployed and ready for production use!"
    echo ""
    echo "🚀 Next Steps:"
    echo "- Monitor application performance"
    echo "- Set up error tracking"
    echo "- Configure backup procedures"
    echo "- Plan user onboarding"
    exit 0
elif (( $(echo "$success_rate >= 80" | bc -l) )); then
    print_warning "⚠️  Most checks passed, but some issues detected"
    echo ""
    echo "🔧 Consider addressing the failed checks before going live"
    exit 1
else
    print_error "❌ Multiple verification checks failed"
    echo ""
    echo "🚨 Please address the issues before considering this deployment production-ready"
    exit 1
fi
