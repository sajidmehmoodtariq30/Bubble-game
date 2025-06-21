# 🎮 Bubble Game - Full Stack Application

A modern, full-stack bubble-popping game built with the MERN stack, featuring user authentication, real-time leaderboards, and comprehensive game statistics.

## 🌟 Overview

This project transforms a classic bubble game into a competitive, social gaming experience with user accounts, achievements, and global leaderboards. Built with modern web technologies for optimal performance and user experience.

## 🚀 Features

### 🎯 Game Features

- **Multiple Game Modes**: Classic, Time Attack, Endless, and Challenge modes
- **Real-time Scoring**: Live score tracking and combo systems
- **Achievements System**: Unlockable milestones and rewards
- **Global Leaderboards**: Compete with players worldwide
- **Game Statistics**: Detailed performance analytics

### 👤 User Management

- **Secure Authentication**: JWT-based login system with refresh tokens
- **User Profiles**: Customizable profiles with avatar uploads
- **Progress Tracking**: Level system and experience points
- **Social Features**: Friend lists and user search

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on all devices
- **Dark/Light Themes**: User preference support
- **Smooth Animations**: Engaging micro-interactions
- **Accessibility**: WCAG compliant design

## 🛠️ Tech Stack

### Frontend (`/client`)

- **React 19** - Latest React with concurrent features
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS v4** - Modern utility-first CSS
- **Shadcn/ui** - High-quality component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Sonner** - Toast notifications
- **Motion** - Animation library

### Backend (`/api`)

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and processing
- **Express Validator** - Input validation
- **Helmet** - Security middleware

## 📁 Project Structure

```
bubble-game/
├── api/                 # Backend Node.js application
│   ├── config/         # Database and service configurations
│   ├── middleware/     # Express middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API route definitions
│   ├── .env.example    # Environment variables template
│   ├── server.js       # Main server file
│   └── README.md       # Backend documentation
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   ├── src/           
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React contexts
│   │   ├── pages/      # Page components
│   │   ├── services/   # API integration
│   │   └── lib/        # Utility functions
│   ├── .env.example    # Environment variables template
│   └── README.md       # Frontend documentation
├── old/                # Original vanilla JS implementation
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── README.md
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account (for avatars)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bubble-game
```

### 2. Backend Setup

```bash
cd api
npm install
cp .env.example .env
# Configure your .env file with database and API keys
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Configure API endpoints in .env
npm run dev
```

### 4. Access the Application

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000>
- API Health Check: <http://localhost:5000/health>

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Game Management

- `POST /api/game/start` - Start game session
- `POST /api/game/end/:id` - End game session
- `GET /api/game/history` - Game history
- `GET /api/game/leaderboard` - Global leaderboard

### User Management

- `GET /api/user/profile` - User profile
- `POST /api/user/avatar` - Upload avatar
- `GET /api/user/stats` - Game statistics

## 🔧 Environment Variables

### Backend (`.env`)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bubble-game

# Authentication
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=Bubble Game
```

## 🚀 Deployment

### Backend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. In `/api` directory: `vercel`
3. Configure environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Frontend (Vercel)

1. In `/client` directory: `vercel`
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy: `vercel --prod`

### Database (MongoDB Atlas)

1. Create cluster at mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in production environment

## 🎮 Game Development Progress

### ✅ Completed

- [x] Project architecture and setup
- [x] User authentication system
- [x] Database models and API endpoints
- [x] Frontend routing and layout
- [x] UI components and styling
- [x] User dashboard and profile

### 🚧 In Progress

- [ ] Game mechanics implementation
- [ ] Real-time game interface
- [ ] Score calculation and validation
- [ ] Achievement system
- [ ] Detailed statistics

### 📋 Planned Features

- [ ] Real-time multiplayer
- [ ] Tournament system
- [ ] Power-ups and special bubbles
- [ ] Mobile app development
- [ ] Social features (friends, chat)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Commit: `git commit -m 'Add new feature'`
5. Push: `git push origin feature/new-feature`
6. Submit a pull request

## 📝 Development Guidelines

### Code Style

- Use ESLint for JavaScript/React
- Follow conventional commit messages
- Write descriptive component and function names
- Add JSDoc comments for complex functions

### Database Design

- Use meaningful field names
- Implement proper indexing
- Add validation at model level
- Use aggregation for complex queries

### Security Best Practices

- Validate all inputs
- Use HTTPS in production
- Implement rate limiting
- Secure JWT tokens
- Sanitize user uploads

## 🔍 Testing

### Backend Testing

```bash
cd api
npm test
```

### Frontend Testing

```bash
cd client
npm test
```

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, caching, connection pooling
- **API**: Pagination, field selection, request compression

## 🆘 Troubleshooting

### Common Issues

1. **Connection refused**: Check if MongoDB is running
2. **CORS errors**: Verify CLIENT_URL in backend .env
3. **Build failures**: Clear node_modules and reinstall
4. **JWT errors**: Check token expiration and secrets

### Support

- Check individual README files in `/api` and `/client`
- Review error logs in development tools
- Ensure all environment variables are set correctly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development Team

- **Original Concept**: Classic bubble game implementation
- **Full-Stack Development**: Modern MERN stack transformation
- **UI/UX Design**: Modern component-based design system

## 🎯 Project Goals

1. **Learning**: Demonstrate modern full-stack development
2. **Performance**: Fast, responsive user experience
3. **Scalability**: Architecture that supports growth
4. **Security**: Production-ready security practices
5. **Maintainability**: Clean, documented codebase

---

**Ready to start popping bubbles? Follow the Quick Start guide above! 🎮**
