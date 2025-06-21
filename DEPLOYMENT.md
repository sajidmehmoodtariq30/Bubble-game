# 🚀 Bubble Game - Vercel Deployment Guide

This guide will help you deploy the Bubble Game application to Vercel with proper environment configuration and CORS setup.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Database hosting at [mongodb.com](https://mongodb.com)
3. **Cloudinary Account**: Image hosting at [cloudinary.com](https://cloudinary.com)
4. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## 🔧 Environment Variables Setup

### API Environment Variables (.env)

Create these environment variables in your Vercel API project:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/bubble
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLIENT_URL=https://your-client-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Environment Variables (.env)

Create these environment variables in your Vercel Client project:

```bash
VITE_API_URL=https://your-api-app.vercel.app/api
VITE_APP_NAME=Bubble Game
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy API**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Set **Root Directory** to `api`
   - Set **Build Command** to `npm install`
   - Set **Output Directory** to `./`
   - Add all API environment variables
   - Click "Deploy"

3. **Deploy Client**
   - Create another new project
   - Import the same repository
   - Set **Root Directory** to `client`
   - Framework will auto-detect as "Vite"
   - Add all Client environment variables
   - Update `VITE_API_URL` with your API domain from step 2
   - Click "Deploy"

4. **Update CORS Settings**
   - Go back to your API project settings
   - Update `CLIENT_URL` environment variable with your client domain
   - Redeploy the API

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy API**
   ```bash
   cd api
   vercel --prod
   ```

4. **Deploy Client**
   ```bash
   cd ../client
   vercel --prod
   ```

5. **Set Environment Variables**
   ```bash
   # For API
   vercel env add CLIENT_URL production
   vercel env add MONGODB_URI production
   vercel env add JWT_SECRET production
   # ... add all other variables

   # For Client
   vercel env add VITE_API_URL production
   ```

## 🔧 Post-Deployment Configuration

### 1. Update Environment Variables

After deployment, you'll need to update the cross-references:

**API Project** - Update these variables:
- `CLIENT_URL` = Your client Vercel URL (e.g., `https://bubble-game-client.vercel.app`)

**Client Project** - Update these variables:
- `VITE_API_URL` = Your API Vercel URL + `/api` (e.g., `https://bubble-game-api.vercel.app/api`)

### 2. Verify CORS Configuration

The API is configured to automatically allow:
- `localhost:5173` (development)
- Any `*.vercel.app` domain
- The specific `CLIENT_URL` environment variable

### 3. Test the Deployment

1. Visit your client URL
2. Try to register/login
3. Upload an avatar
4. Play a game
5. Check the leaderboard

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors:

1. **Check Console**: Look for specific CORS error messages
2. **Verify Environment Variables**: Ensure `CLIENT_URL` in API matches your client domain exactly
3. **Check Network Tab**: Verify API calls are going to the correct domain
4. **Redeploy**: After updating environment variables, redeploy both projects

### Common Issues

1. **API not responding**: Check Vercel function logs in dashboard
2. **Database connection**: Verify MongoDB URI and IP whitelist settings
3. **Image upload failing**: Check Cloudinary credentials
4. **Authentication issues**: Verify JWT secrets are set correctly

### Environment Variable Verification

Add this to your API health check to verify env vars (remove in production):

```javascript
// In server.js health check (TEMPORARY - REMOVE AFTER TESTING)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running!',
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      clientUrl: process.env.CLIENT_URL
    }
  });
});
```

## 📱 Production Optimizations

### API Optimizations
- Enable compression ✅
- Rate limiting ✅
- Security headers ✅
- Error handling ✅

### Client Optimizations
- Code splitting (automatic with Vite) ✅
- Asset optimization ✅
- Service worker for caching (can be added)
- Progressive Web App features (can be added)

## 🔐 Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] Cloudinary upload restrictions set
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced (automatic with Vercel)

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check browser network tab for detailed errors

---

🎉 **Happy Gaming!** Your Bubble Game should now be live on Vercel!
