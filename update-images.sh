#!/bin/bash

# THERAPY EQUIPPED - Image Update Script
# This script helps you organize product images

echo "🖼️  THERAPY EQUIPPED - Image Update Script"
echo "=========================================="
echo ""

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Checking for new images..."
echo ""

# Function to copy and confirm
copy_image() {
    local source=$1
    local dest=$2
    local description=$3

    if [ -f "$source" ]; then
        cp "$source" "$dest"
        echo "✅ $description"
        return 0
    else
        echo "⏭️  Skipped: $description (file not found)"
        return 1
    fi
}

# Update TEgun Pro main image with 5.png
echo "🔄 Updating TEgun Pro images..."
if copy_image "public/images/5.png" "public/images/products/tegun-pro/main.png" "TEgun Pro main image (5.png)"; then
    echo "   → Main product photo updated!"
fi

# Add attachment guide (4.png) to both products
echo ""
echo "🔄 Adding attachment guide images..."
copy_image "public/images/4.png" "public/images/products/tegun-pro/detail-5.png" "TEgun Pro attachment guide"
copy_image "public/images/4.png" "public/images/products/tegun-lite/detail-attachment.png" "TEgun Lite attachment guide"

# Check for other numbered images
echo ""
echo "🔍 Checking for additional numbered images (1-10)..."
for i in {1..10}; do
    if [ -f "public/images/${i}.png" ]; then
        echo "   Found: ${i}.png (not auto-assigned - manual placement needed)"
    fi
done

echo ""
echo "=========================================="
echo "✨ Image update complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart dev server: npm run dev"
echo "   2. Check product pages to verify images"
echo "   3. Update products.ts if needed to reference new images"
echo ""
echo "💡 Tip: If you added 4.png and 5.png, they should now be visible!"
echo ""
