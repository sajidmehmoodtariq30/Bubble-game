# Bubble Game API

A modern Node.js/Express backend for the Bubble Game application with user authentication, game statistics, and leaderboards.

## 🚀 Features

- **User Authentication**: JWT-based auth with refresh tokens
- **User Management**: Profile management with avatar uploads (Cloudinary)
- **Game Sessions**: Track game sessions with detailed statistics
- **Leaderboards**: Global and game-mode specific rankings
- **Achievements**: Unlock system for player progression
- **Security**: Rate limiting, CORS, input validation
- **Modern Stack**: Node.js, Express, MongoDB, Cloudinary

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for avatar uploads)

## 🛠️ Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your configuration values:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/bubble-game
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bubble-game

   # JWT Secrets (generate strong secrets for production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Client URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

3. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user
- `POST /refresh` - Refresh access token
- `POST /forgotpassword` - Send password reset email
- `PUT /resetpassword/:token` - Reset password

### User Routes (`/api/user`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /avatar` - Upload avatar
- `DELETE /avatar` - Delete avatar
- `PUT /preferences` - Update preferences
- `GET /stats` - Get game statistics
- `GET /leaderboard` - Get leaderboard
- `GET /search` - Search users
- `DELETE /account` - Delete account

### Game Routes (`/api/game`)

- `POST /start` - Start new game session
- `POST /end/:sessionId` - End game session
- `GET /history` - Get game history
- `GET /best-scores` - Get best scores by mode
- `GET /leaderboard/:gameMode` - Get game leaderboard
- `POST /event/:sessionId` - Record game event
- `GET /analytics` - Get game analytics

## 🗃️ Database Models

### User Model

- Authentication (username, email, password)
- Profile information (name, bio, avatar)
- Game statistics (scores, achievements, level)
- Preferences (theme, sound, notifications)

### GameSession Model

- Session tracking (user, score, duration)
- Game metrics (accuracy, bubbles hit/total)
- Game events (bubble hits, power-ups, etc.)
- Different game modes and difficulties

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Access and refresh token system
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **Input Validation**: express-validator for all inputs
- **CORS**: Configured for client domain
- **Helmet**: Security headers
- **File Upload**: Secure avatar uploads to Cloudinary

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Configure environment variables in Vercel dashboard
4. Deploy with `vercel --prod`

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Strong secret for refresh tokens
- `CLOUDINARY_*` - Your Cloudinary credentials
- `CLIENT_URL` - Your frontend domain
- `NODE_ENV=production`

## 📊 Game Statistics

The API tracks comprehensive game statistics:

- **Player Stats**: Games played, high scores, accuracy
- **Session Data**: Duration, bubbles hit/missed, score progression
- **Achievements**: Unlockable milestones and rewards
- **Leaderboards**: Global rankings by game mode
- **Analytics**: Performance trends and improvement tracking

## 🎮 Game Modes Supported

- **Classic**: 30-second bubble popping
- **Time Attack**: Fast-paced with shorter time limits
- **Endless**: Play until you can't keep up
- **Challenge**: Special objectives and rules

## 🤝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## 📝 Development

- **Linting**: ESLint configuration included
- **Hot Reload**: nodemon for development
- **Logging**: Comprehensive error logging
- **Validation**: Input validation on all routes
- **Documentation**: JSDoc comments throughout

## 🔧 Configuration

Key configuration options in `.env`:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `RATE_LIMIT_*` - Rate limiting configuration
- `JWT_EXPIRE` - Token expiration times

## 📈 Monitoring

Health check endpoint available at `/health` for monitoring services.

## 🆘 Support

For issues or questions:

1. Check the error logs
2. Verify environment variables
3. Ensure MongoDB connection
4. Check Cloudinary configuration
5. Review CORS settings for client connectivity
