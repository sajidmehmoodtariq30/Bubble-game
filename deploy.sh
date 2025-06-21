#!/bin/bash

# Bubble Game Deployment Script for Vercel
echo "🚀 Starting Bubble Game deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Deploying API to Vercel..."
cd api
vercel --prod
echo "✅ API deployed successfully!"

echo "📦 Deploying Client to Vercel..."
cd ../client
vercel --prod
echo "✅ Client deployed successfully!"

echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update your CLIENT_URL environment variable in API with the client Vercel URL"
echo "2. Update your VITE_API_URL environment variable in Client with the API Vercel URL"
echo "3. Verify CORS settings are working correctly"
echo ""
echo "🔧 Environment Variables to Set:"
echo "API (Vercel Dashboard):"
echo "  - CLIENT_URL=https://your-client-domain.vercel.app"
echo "  - MONGODB_URI=your-mongodb-connection-string"
echo "  - JWT_SECRET=your-jwt-secret"
echo "  - CLOUDINARY_CLOUD_NAME=your-cloudinary-name"
echo "  - CLOUDINARY_API_KEY=your-cloudinary-key"
echo "  - CLOUDINARY_API_SECRET=your-cloudinary-secret"
echo ""
echo "Client (Vercel Dashboard):"
echo "  - VITE_API_URL=https://your-api-domain.vercel.app/api"
