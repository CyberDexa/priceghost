# PriceGhost Browser Extension

## Installation (Development)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The PriceGhost extension should now appear in your toolbar!

## Creating Icons

Before loading the extension, you need to create icon files. You can:

### Option 1: Use placeholder icons
Create simple PNG files at these sizes:
- `icons/icon16.png` (16x16)
- `icons/icon32.png` (32x32)
- `icons/icon48.png` (48x48)
- `icons/icon128.png` (128x128)

### Option 2: Convert the SVG
Use the included `icon.svg` and convert it to PNG at different sizes.

On macOS with ImageMagick:
```bash
brew install imagemagick
cd extension/icons
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 32x32 icon32.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Option 3: Use online converter
1. Go to https://convertio.co/svg-png/
2. Upload `icon.svg`
3. Convert and download at each size

## Usage

1. Navigate to a product page on Amazon, Walmart, Best Buy, Target, or any online store
2. Click the PriceGhost extension icon in your toolbar
3. Sign in with your PriceGhost account
4. Set an optional target price
5. Click "Track This Product"

The extension will:
- Show a floating 👻 button on product pages
- Display a "+" badge when on a trackable product page
- Let you quickly add products without leaving the page

## Features

- **Quick Add**: Add products in 2 clicks
- **Auto-detect**: Automatically detects product info
- **Target Alerts**: Set target prices for notifications
- **Already Tracking**: Shows if you're already tracking a product
- **Dashboard Link**: Quick access to your PriceGhost dashboard

## Configuration

By default, the extension connects to `http://localhost:3000`.

For production, update the `API_URL` in `popup.js`:
```javascript
const API_URL = "https://your-production-url.com";
```

## Troubleshooting

**Extension not loading?**
- Make sure you have icon files in the `icons` folder
- Check the Chrome console for errors

**Can't sign in?**
- Make sure the PriceGhost web app is running
- Check that cookies/storage permissions are granted

**Product not detected?**
- Try reloading the page
- Some product pages may not be supported yet
