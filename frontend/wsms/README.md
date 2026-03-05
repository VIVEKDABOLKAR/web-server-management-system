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

## 🔧 Setup

1. Update API URL in `src/services/api.js`:
```javascript
baseURL: 'http://localhost:5000'  // Your backend URL
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
