#!/bin/bash

echo "🚀 Knoux SmartOrganizer PRO - تحضير للنشر"
echo "=============================================="

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Setup React UI
echo "⚛️ Setting up React UI..."
cd ui
npm install
cd ..

# 3. Build React app
echo "🔨 Building React UI..."
cd ui
npm run build
cd ..

# 4. Build Electron app
echo "🖥️ Building Electron app..."

# For Windows
echo "📦 Building for Windows..."
npm run build-win

# For macOS
echo "🍎 Building for macOS..."
npm run build-mac

echo "✅ Build completed!"
echo ""
echo "📁 Find your executables in:"
echo "   - Windows: dist/Knoux SmartOrganizer PRO Setup.exe"
echo "   - macOS: dist/Knoux SmartOrganizer PRO.dmg"
echo ""
echo "🎉 Ready to distribute!"
