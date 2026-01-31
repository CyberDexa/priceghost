#!/bin/bash
# Script to generate PWA icons from a base SVG
# Usage: ./generate-icons.sh

# Create a simple ghost SVG icon
cat > icon.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <g transform="translate(106, 80)">
    <!-- Ghost body -->
    <path d="M150 0C67.2 0 0 67.2 0 150v170c0 16 13 29 29 29 16 0 29-13 29-29v-29c0-16 13-29 29-29s29 13 29 29v29c0 16 13 29 29 29 16 0 29-13 29-29v-29c0-16 13-29 29-29s29 13 29 29v29c0 16 13 29 29 29 16 0 29-13 29-29V150C300 67.2 232.8 0 150 0z" fill="white"/>
    <!-- Eyes -->
    <circle cx="100" cy="140" r="25" fill="#1f2937"/>
    <circle cx="200" cy="140" r="25" fill="#1f2937"/>
    <!-- Eye shine -->
    <circle cx="92" cy="132" r="8" fill="white"/>
    <circle cx="192" cy="132" r="8" fill="white"/>
  </g>
</svg>
SVGEOF

# Generate icons at different sizes
SIZES="72 96 128 144 152 192 384 512"

for size in $SIZES; do
  if command -v convert &> /dev/null; then
    convert -background none -resize ${size}x${size} icon.svg icon-${size}x${size}.png
    echo "Generated icon-${size}x${size}.png"
  elif command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w $size -h $size icon.svg > icon-${size}x${size}.png
    echo "Generated icon-${size}x${size}.png"
  else
    echo "No image converter found. Please install ImageMagick or librsvg."
    echo "  brew install imagemagick"
    echo "  or"
    echo "  brew install librsvg"
    break
  fi
done

# Create favicon.ico if possible
if command -v convert &> /dev/null; then
  convert icon.svg -resize 32x32 favicon.ico
  convert icon.svg -resize 180x180 apple-touch-icon.png
  echo "Generated favicon.ico and apple-touch-icon.png"
fi

echo ""
echo "Icon generation complete!"
echo "Move the generated files to your public/icons directory."
