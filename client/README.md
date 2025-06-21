# Bubble Game Client

A modern React frontend for the Bubble Game application built with Vite, Tailwind CSS, and Shadcn/ui components.

## 🚀 Features

- **Modern React 19**: Latest React features and hooks
- **Vite Build Tool**: Lightning-fast development and builds
- **Tailwind CSS v4**: Latest utility-first CSS framework
- **Shadcn/ui Components**: Beautiful, accessible UI components
- **Authentication System**: Complete login/register flow
- **Game Integration**: Real-time game interface
- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: User preference support
- **Animations**: Smooth transitions and micro-interactions

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite 6** - Next generation frontend tooling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **Motion** - Animation library
- **Sonner** - Toast notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure your API endpoints

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎮 Current Implementation Status

✅ **Completed Features:**
- Complete authentication system (login/register)
- Modern UI with Shadcn/ui components
- Responsive navigation and layout
- Dashboard with user statistics
- Leaderboard display
- Protected and public routes
- API integration layer
- Toast notifications
- Form validation

🚧 **In Development:**
- Actual bubble game implementation
- Real-time game mechanics
- Statistics tracking
- Profile management
- Settings and preferences

## 🚀 Quick Start

1. Start the backend API (see api/README.md)
2. Install client dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Start development server: `npm run dev`
5. Open http://localhost:5173

## 📱 Pages Available

- **/** - Landing page with game overview
- **/about** - Game information and how to play
- **/login** - User authentication
- **/register** - Account creation
- **/dashboard** - User dashboard (protected)
- **/leaderboard** - Global rankings
- **/game** - Game interface (in development)

## 🔧 Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚀 Deployment

Ready for deployment to Vercel, Netlify, or any static hosting platform.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
