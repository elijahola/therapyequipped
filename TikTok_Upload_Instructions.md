# TikTok Seller Center Upload Instructions

## ⚠️ IMPORTANT: You MUST Do This FIRST

### Step 1: Upload All Product Images to TikTok Media Library

1. Go to **TikTok Seller Center** → **Products** → **Media**
2. Click **Upload Images**
3. Upload ALL your product images from `/public/images/products/`
4. After upload, **copy the TikTok CDN URL** for each image (format: `https://p16-oec-va.ibyteimg.com/...`)
5. Save these URLs - you'll need them for the CSV

**Images to upload:**

**TEgun Pro** (8 images):
- `/public/images/products/tegun-pro/5.png`
- `/public/images/products/tegun-pro/lifestyle-1.png`
- `/public/images/products/tegun-pro/lifestyle-2.png`
- `/public/images/products/tegun-pro/lifestyle-3.png`
- `/public/images/products/tegun-pro/detail-1.png`
- `/public/images/products/tegun-pro/detail-2.png`
- `/public/images/products/tegun-pro/detail-3.png`
- `/public/images/products/tegun-pro/detail-4.png`

**TEgun Lite - Green Goblin** (5 images):
- `/public/images/products/tegun-lite/main-green-goblin.png`
- `/public/images/products/tegun-lite/lifestyle-green-goblin-1.png`
- `/public/images/products/tegun-lite/lifestyle-1.png`
- `/public/images/products/tegun-lite/lifestyle-2.png`
- `/public/images/products/tegun-lite/detail-green-goblin-1.png`

**TEgun Lite - Flash** (5 images):
- `/public/images/products/tegun-lite/main-flash.png`
- `/public/images/products/tegun-lite/lifestyle-flash-1.png`
- `/public/images/products/tegun-lite/lifestyle-1.png`
- `/public/images/products/tegun-lite/lifestyle-3.png`
- `/public/images/products/tegun-lite/detail-flash-1.png`

**TEgun Lite - Venom** (6 images):
- `/public/images/products/tegun-lite/main-venom.png`
- `/public/images/products/tegun-lite/lifestyle-venom-1.png`
- `/public/images/products/tegun-lite/lifestyle-1.png`
- `/public/images/products/tegun-lite/lifestyle-2.png`
- `/public/images/products/tegun-lite/detail-venom-1.png`
- `/public/images/products/tegun-lite/detail-venom-2.png`

**TEroller** (1 image):
- `/public/images/products/teroller/main.png`

**TEboard** (1 image):
- `/public/images/products/teboard/main.png`

---

### Step 2: Register Your Brand

1. Go to **TikTok Seller Center** → **Products** → **Brands**
2. Click **Add Brand**
3. Enter **THERAPY EQUIPPED**
4. After approval, copy the **Brand ID** (will be in format: Brand Name (123456))

---

### Step 3: Select Your Categories

When filling the CSV, use TikTok's category selector to find the exact category path format.

**Recommended categories:**
- **TEgun Pro & Lite**: `Health & Wellness/Massage & Relaxation/Massage Tools`
- **TEroller**: `Health & Wellness/Massage & Relaxation/Foam Rollers`
- **TEboard**: `Sports & Outdoors/Exercise & Fitness/Strength Training Equipment`

---

### Step 4: Fill the CSV Template

After completing Steps 1-3, I'll create a CSV template for you with placeholders for:
- TikTok Media Library image URLs
- Brand ID
- Exact category paths

---

## Common Upload Errors:

### Error: "Invalid image URL"
**Solution**: Images must be uploaded to TikTok Media Library first. External URLs don't work.

### Error: "Category not found"
**Solution**: Use exact category path from TikTok's dropdown (with `/` not `>`)

### Error: "Brand not found"
**Solution**: Register brand first and use format "Brand Name (ID)"

### Error: "Identifier code required"
**Solution**: Use `GTIN (1)` as Identifier Code Type and any 12-digit number (e.g., `000000000000`)

---

## Ready to Continue?

Once you've uploaded images to TikTok Media Library and have the CDN URLs, let me know and I'll create a CSV template with proper placeholders for you to fill in.

Or if you want, you can manually edit the CSV I created and:
1. Replace all image URLs with TikTok CDN URLs
2. Fix category format (use `/` instead of `>`)
3. Add brand ID in format: `THERAPY EQUIPPED (your-id)`
4. Change Identifier Code Type from `SKU` to `GTIN (1)`
5. Use 12-digit number for Identifier Code (e.g., `000000000000`)
