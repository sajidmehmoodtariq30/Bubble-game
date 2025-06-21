# 🚀 Quick Deployment Checklist

## Before Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] MongoDB Atlas database is set up
- [ ] Cloudinary account is configured
- [ ] Environment variables are documented in .env.example files

## API Deployment

- [ ] Deploy API to Vercel
- [ ] Set all environment variables in Vercel dashboard:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET` (32+ characters)
  - [ ] `JWT_REFRESH_SECRET` (32+ characters)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `CLIENT_URL` (will update after client deployment)
  - [ ] `NODE_ENV=production`

## Client Deployment

- [ ] Deploy Client to Vercel
- [ ] Set environment variables in Vercel dashboard:
  - [ ] `VITE_API_URL` (API domain + /api)
  - [ ] `VITE_NODE_ENV=production`

## Post-Deployment

- [ ] Update `CLIENT_URL` in API with client domain
- [ ] Redeploy API
- [ ] Test the application:
  - [ ] Registration works
  - [ ] Login works
  - [ ] Game play works
  - [ ] Avatar upload works
  - [ ] Leaderboard loads
  - [ ] No CORS errors in console

## Environment Variable Template

### API (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-32-char-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=https://your-client.vercel.app
```

### Client (.env)
```
VITE_API_URL=https://your-api.vercel.app/api
VITE_NODE_ENV=production
```

## Quick Commands

```bash
# Deploy API
cd api && npm run deploy

# Deploy Client
cd client && npm run deploy
```

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Cloudinary Dashboard](https://cloudinary.com/console)
