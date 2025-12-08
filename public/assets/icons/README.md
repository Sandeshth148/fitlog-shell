# PWA Icons

## Current Status
The `icon.svg` file contains the FitLog logo design.

## Required Icon Sizes
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## How to Generate Icons

### Option 1: Using Online Tool (Easiest)
1. Go to: https://realfavicongenerator.net/
2. Upload `icon.svg`
3. Generate all sizes
4. Download and extract to this folder

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run:
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Option 3: Using Node Script
```bash
npm install sharp --save-dev
node generate-icons.js
```

## Temporary Solution
For development, the app will work without icons. The manifest references them, but browsers will gracefully handle missing icons.

## Production
Before deploying to production, generate all required icon sizes.
