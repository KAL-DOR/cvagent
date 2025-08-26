#!/bin/bash

# CV Agent Setup Script
echo "🚀 Setting up CV Agent..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your OpenAI API key"
else
    echo "✅ .env.local already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 CV Agent is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.local with your OpenAI API key"
    echo "2. Run 'npm run dev' to start the development server"
    echo "3. Visit http://localhost:3000"
    echo ""
    echo "For deployment instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
