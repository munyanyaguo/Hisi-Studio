#!/bin/bash

# Hisi Studio API Test Script
# This script tests all major endpoints

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Hisi Studio API Test ===${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$BODY" | python3 -m json.tool
else
    echo -e "${RED}✗ Health check failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 2: Root Endpoint
echo -e "${YELLOW}2. Testing Root Endpoint...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Root endpoint passed${NC}"
    echo "$BODY" | python3 -m json.tool
else
    echo -e "${RED}✗ Root endpoint failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 3: Register User
echo -e "${YELLOW}3. Testing User Registration...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_'$(date +%s)'@example.com",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "User"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ User registration passed${NC}"
    ACCESS_TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])" 2>/dev/null)
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
else
    echo -e "${RED}✗ User registration failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | python3 -m json.tool
fi
echo ""

# Test 4: Login
echo -e "${YELLOW}4. Testing Login (with existing credentials)...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hisi.com",
    "password": "Admin123!"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Login passed${NC}"
    ACCESS_TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])" 2>/dev/null)
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
else
    echo -e "${YELLOW}⚠ Login failed - admin user may not exist (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 5: Get Products
echo -e "${YELLOW}5. Testing Get Products...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/products?page=1&per_page=5")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Get products passed${NC}"
    PRODUCT_COUNT=$(echo "$BODY" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('data', {}).get('products', [])))" 2>/dev/null)
    echo "Found $PRODUCT_COUNT products"
else
    echo -e "${RED}✗ Get products failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 6: Get Categories
echo -e "${YELLOW}6. Testing Get Categories...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/products/categories")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Get categories passed${NC}"
    CATEGORY_COUNT=$(echo "$BODY" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('data', [])))" 2>/dev/null)
    echo "Found $CATEGORY_COUNT categories"
else
    echo -e "${RED}✗ Get categories failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 7: Get Cart (Guest)
echo -e "${YELLOW}7. Testing Get Cart (Guest)...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/cart" -c /tmp/cookies.txt)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Get cart (guest) passed${NC}"
    echo "$BODY" | python3 -c "import sys, json; data = json.load(sys.stdin); print(f\"Cart ID: {data['data']['id'][:20]}...\"); print(f\"Items: {data['data']['item_count']}\")" 2>/dev/null
else
    echo -e "${RED}✗ Get cart failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 8: Get CMS Pages
echo -e "${YELLOW}8. Testing Get CMS Pages...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/pages")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Get CMS pages passed${NC}"
    PAGE_COUNT=$(echo "$BODY" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('data', [])))" 2>/dev/null)
    echo "Found $PAGE_COUNT pages"
else
    echo -e "${RED}✗ Get CMS pages failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 9: Get Blog Posts
echo -e "${YELLOW}9. Testing Get Blog Posts...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/blog?page=1&per_page=5")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Get blog posts passed${NC}"
    POST_COUNT=$(echo "$BODY" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('data', {}).get('posts', [])))" 2>/dev/null)
    echo "Found $POST_COUNT blog posts"
else
    echo -e "${RED}✗ Get blog posts failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 10: Get Site Settings
echo -e "${YELLOW}10. Testing Get Site Settings...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/settings")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Get site settings passed${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -15
else
    echo -e "${RED}✗ Get site settings failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 11: Newsletter Subscribe
echo -e "${YELLOW}11. Testing Newsletter Subscribe...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newsletter_'$(date +%s)'@example.com"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Newsletter subscribe passed${NC}"
else
    echo -e "${RED}✗ Newsletter subscribe failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null
fi
echo ""

# Test 12: Contact Form
echo -e "${YELLOW}12. Testing Contact Form...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "contact@example.com",
    "subject": "Test Subject",
    "message": "This is a test message"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Contact form passed${NC}"
else
    echo -e "${RED}✗ Contact form failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null
fi
echo ""

echo -e "${YELLOW}=== Test Summary ===${NC}"
echo "All major endpoints have been tested!"
echo ""
echo "For authenticated endpoints (addresses, orders, admin routes),"
echo "you need to:"
echo "1. Create an admin user in the database"
echo "2. Get an access token via login"
echo "3. Include it in the Authorization header"
echo ""
echo "Example:"
echo "curl -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\"
echo "  $BASE_URL/api/v1/auth/me"
