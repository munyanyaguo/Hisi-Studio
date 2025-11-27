#!/bin/bash

echo "🔍 Verifying Hisi Studio Project Structure..."
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 ${YELLOW}(MISSING)${NC}"
        return 1
    fi
}

missing_count=0

echo "📁 CLIENT Structure:"
echo ""
echo "Public folders:"
check_dir "client/public/images/hero" || ((missing_count++))
check_dir "client/public/images/products" || ((missing_count++))
check_dir "client/public/images/brand" || ((missing_count++))
check_dir "client/public/images/about/team" || ((missing_count++))
check_dir "client/public/fonts" || ((missing_count++))

echo ""
echo "Component folders:"
check_dir "client/src/components/layout" || ((missing_count++))
check_dir "client/src/components/home" || ((missing_count++))
check_dir "client/src/components/shop" || ((missing_count++))
check_dir "client/src/components/product" || ((missing_count++))
check_dir "client/src/components/cart" || ((missing_count++))
check_dir "client/src/components/checkout" || ((missing_count++))
check_dir "client/src/components/admin/dashboard" || ((missing_count++))
check_dir "client/src/components/admin/products" || ((missing_count++))
check_dir "client/src/components/admin/orders" || ((missing_count++))
check_dir "client/src/components/admin/cms" || ((missing_count++))
check_dir "client/src/components/admin/settings" || ((missing_count++))
check_dir "client/src/components/ui" || ((missing_count++))

echo ""
echo "Page folders:"
check_dir "client/src/pages/customer" || ((missing_count++))
check_dir "client/src/pages/auth" || ((missing_count++))
check_dir "client/src/pages/account" || ((missing_count++))
check_dir "client/src/pages/admin" || ((missing_count++))
check_dir "client/src/pages/error" || ((missing_count++))

echo ""
echo "Feature folders:"
check_dir "client/src/features/auth" || ((missing_count++))
check_dir "client/src/features/cart" || ((missing_count++))
check_dir "client/src/features/products" || ((missing_count++))
check_dir "client/src/features/orders" || ((missing_count++))
check_dir "client/src/features/user" || ((missing_count++))
check_dir "client/src/features/admin" || ((missing_count++))

echo ""
echo "Other client folders:"
check_dir "client/src/store" || ((missing_count++))
check_dir "client/src/services" || ((missing_count++))
check_dir "client/src/routes" || ((missing_count++))
check_dir "client/src/contexts" || ((missing_count++))
check_dir "client/src/config" || ((missing_count++))
check_dir "client/src/styles" || ((missing_count++))

echo ""
echo "📁 SERVER Structure:"
echo ""
check_dir "server/app/config" || ((missing_count++))
check_dir "server/app/models" || ((missing_count++))
check_dir "server/app/routes" || ((missing_count++))
check_dir "server/app/services" || ((missing_count++))
check_dir "server/app/middleware" || ((missing_count++))
check_dir "server/app/utils" || ((missing_count++))
check_dir "server/app/tasks" || ((missing_count++))
check_dir "server/migrations/versions" || ((missing_count++))
check_dir "server/tests" || ((missing_count++))
check_dir "server/scripts" || ((missing_count++))

echo ""
echo "📁 ROOT Structure:"
echo ""
check_dir ".github/workflows" || ((missing_count++))

echo ""
echo "================================"
if [ $missing_count -eq 0 ]; then
    echo -e "${GREEN}✅ All folders present! Structure is complete.${NC}"
else
    echo -e "${RED}❌ Missing $missing_count folders${NC}"
    echo ""
    echo "Run this command to create missing folders:"
    echo -e "${YELLOW}./create-missing-folders.sh${NC}"
fi
echo "================================"
