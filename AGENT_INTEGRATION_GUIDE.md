# WSMS Agent ↔️ Backend Connection Guide

## 🎯 Overview

The WSMS (Web Server Management System) monitoring agent now connects with your backend API to send real-time server metrics. This guide explains the complete integration.

## 📋 Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Agent (Java)   │ ─HTTP─→ │  Backend (API)   │ ←─HTTP─ │ Frontend (React) │
│  Collects Data  │         │  Stores Metrics  │         │ Displays Metrics │
└─────────────────┘         └──────────────────┘         └──────────────────┘
```

## 🔧 What Was Implemented

### 1. **Agent Side** (`server_agent-main/`)
- ✅ Added Gson dependency for JSON handling
- ✅ Created `MetricSender.java` - HTTP client to send metrics
- ✅ Updated `Config.java` - Loads configuration from `config.json`
- ✅ Updated `Agent.java` - Sends metrics after collection
- ✅ Added `config.json` - Configuration file template

### 2. **Backend Side** (`backend/wsms/`)
- ✅ Created `MetricRepository.java` - Database access for metrics
- ✅ Created `MetricService.java` - Business logic for metric processing
- ✅ Created `AgentController.java` - API endpoint for agents (`/api/agent/metrics`)
- ✅ Created `MetricController.java` - API endpoint for frontend (`/api/metrics/server/{id}`)
- ✅ Updated `Metric` entity - Added `diskUsage` field
- ✅ Updated `SecurityConfig` - Allowed agent endpoints without JWT
- ✅ Created DTOs - `MetricSubmitRequest` and `MetricResponse`

### 3. **Frontend Side** (`frontend/wsms/`)
- ✅ Updated `ServerDetails.jsx` - Fetches and displays real-time metrics
- ✅ Added time range filters (1h, 6h, 24h, 7d)
- ✅ Added metrics history table
- ✅ Auto-refresh every 30 seconds

## 🚀 Setup Instructions

### Step 1: Start Backend
```powershell
cd "c:\Users\700086\Desktop\Web Server\backend\wsms"
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

### Step 2: Start Frontend
```powershell
cd "c:\Users\700086\Desktop\Web Server\frontend\wsms"
npm run dev
```
Frontend will start on `http://localhost:5173`

### Step 3: Register a Server
1. Open browser: http://localhost:5173
2. Login or signup
3. Click **"+ Add Server"**
4. Fill in:
   - Server Name: `My Test Server`
   - IP Address: `192.168.1.100` (or your actual IP)
   - OS Type: Select your OS
   - Web Server Type: Select type
5. Click **"Add Server"**
6. **Copy the Server ID and Agent Token** (displayed after creation)

### Step 4: Configure Agent
1. Open `server_agent-main/config.json`
2. Update:
```json
{
  "server_id_long": 1,  // ← Your Server ID from Step 3
  "auth_token": "your-agent-token-here",  // ← Your Agent Token from Step 3
  "backend_url": "http://localhost:8080",
  "collection_interval": 10
}
```

### Step 5: Build and Run Agent
```powershell
cd "c:\Users\700086\Desktop\Web Server\server_agent-main"

# Build the agent
mvn clean compile

# Run the agent
mvn exec:java
```

When prompted:
- Choose **Option 1**: Start collecting metrics
- Agent will start sending metrics every 10 seconds

### Step 6: View Metrics
1. Go to Dashboard: http://localhost:5173/dashboard
2. Click on your server
3. Watch metrics update in real-time! 🎉

## 📊 API Endpoints

### Agent Endpoints (No JWT Required)
- `POST /api/agent/metrics` - Submit metrics from agent
- `POST /api/agent/heartbeat` - Send heartbeat signal

**Authentication:** Bearer token (agent's token from server creation)

### Frontend Endpoints (JWT Required)
- `GET /api/metrics/server/{id}` - Get last 100 metrics
- `GET /api/metrics/server/{id}/recent?hours=24` - Get metrics for time range

## 🔍 How It Works

1. **Agent collects metrics** every N seconds (configured in `config.json`)
   - CPU usage via `CPUCollector`
   - Memory usage via `MemoryCollector`
   - Disk usage via `DiskCollector`

2. **Agent sends metrics** to backend via HTTP POST
   ```
   POST http://localhost:8080/api/agent/metrics
   Authorization: Bearer <agent-token>
   Body: {
     "serverId": 1,
     "cpuUsage": 45.5,
     "memoryUsage": 67.2,
     "diskUsage": 52.1,
     "timestamp": "2026-03-06T10:30:00Z"
   }
   ```

3. **Backend validates** agent token and server ID

4. **Backend determines status** based on thresholds:
   - CPU > 90% OR Memory > 90% OR Disk > 95% → **ERROR**
   - CPU > 75% OR Memory > 75% OR Disk > 85% → **WARNING**
   - Otherwise → **ACTIVE**

5. **Backend saves** metric to PostgreSQL database

6. **Frontend fetches** and displays metrics
   - Auto-refreshes every 30 seconds
   - Shows latest values in cards
   - Displays history in table

## 🐛 Troubleshooting

### Agent Issues

**"Invalid agent token"**
- Verify token in `config.json` matches server's `agentToken` in database
- Check Authorization header is sent correctly

**"Server not found"**
- Verify `server_id_long` in `config.json` matches database ID
- Check server exists in backend

**Connection refused**
- Ensure backend is running on port 8080
- Check firewall settings
- Verify `backend_url` in config.json

### Backend Issues

**Metrics not saving**
- Check PostgreSQL is running
- Verify database connection in `application.properties`
- Check backend logs for errors

### Frontend Issues

**"Failed to fetch metrics"**
- Verify JWT token is valid
- Check browser console for errors
- Ensure backend API is accessible

## 📝 Configuration Reference

### Agent `config.json`
```json
{
  "server_id_long": 1,              // Database server ID
  "auth_token": "abc123...",        // Agent authentication token
  "backend_url": "http://localhost:8080",
  "collection_interval": 10,         // Seconds between collections
  "cpu_threshold": 80.0,            // CPU warning threshold %
  "memory_threshold": 85.0,          // Memory warning threshold %
  "disk_threshold": 90.0,           // Disk warning threshold %
  "log_file": "agent.log"           // Log file path
}
```

## ✅ Verification Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] PostgreSQL database running and accessible
- [ ] Server created in frontend with ID and token
- [ ] Agent `config.json` updated with correct ID and token
- [ ] Agent running and collecting metrics
- [ ] Agent logs show "✓ Metrics sent successfully"
- [ ] Frontend displays real-time metrics
- [ ] Metrics history table populating

## 🎉 Success!

If everything is working:
- Agent logs will show: `✓ Metrics sent successfully to backend`
- Backend logs will show: `Metric saved successfully for server: <name>`
- Frontend will display real-time CPU, Memory, and Disk metrics
- Server status will update automatically based on metrics

Your WSMS is now fully integrated! 🚀
