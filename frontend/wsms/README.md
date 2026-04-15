# Web Server Monitoring System (WSMS)

A React frontend for monitoring web servers.

## 📦 Install

```bash
npm install
```

## 🚀 Run

```bash
npm run dev
```

## 🔧 Environment Setup

1. Configure environment values in `.env.development` and `.env.production`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
```

2. For production builds, set values in `.env.production` (already configured for Render):

```env
VITE_API_BASE_URL=https://web-server-management-system.onrender.com
VITE_WS_BASE_URL=wss://web-server-management-system.onrender.com
```

## 📁 Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components  
├── services/       # API services
├── App.jsx         # Main app with routes
└── main.jsx       # Entry point
```

## 🔑 Pages

- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Server list (protected)
- `/servers/:id` - Server details (protected)

## 🔐 Authentication

JWT token stored in localStorage and automatically added to API requests.
