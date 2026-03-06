# 🚀 Quick Start Guide - WSMS Agent Connection

## Overview
This guide will help you quickly connect your monitoring agent with the WSMS backend.

## Prerequisites
- ✅ Java 21 installed
- ✅ Maven installed
- ✅ PostgreSQL running
- ✅ Backend running on port 8080
- ✅ Frontend running on port 5173

## 5-Minute Setup

### 1️⃣ Register Server in Frontend
```
1. Open http://localhost:5173
2. Login/Signup
3. Click "+ Add Server"
4. Fill details and create
5. COPY the Server ID and Agent Token shown
```

### 2️⃣ Configure Agent
Edit `server_agent-main/config.json`:
```json
{
  "server_id_long": YOUR_SERVER_ID_HERE,
  "auth_token": "YOUR_AGENT_TOKEN_HERE",
  "backend_url": "http://localhost:8080",
  "collection_interval": 10
}
```

### 3️⃣ Run Agent
```powershell
cd server_agent-main
mvn clean compile
mvn exec:java
```
Choose Option 1 when prompted.

### 4️⃣ Verify Connection
Check agent log for:
```
✓ Metrics sent successfully to backend
```

### 5️⃣ View Metrics
- Go to Dashboard
- Click your server
- See real-time metrics! 🎉

## Troubleshooting

### "Invalid agent token"
→ Copy token again from server details

### "Server not found"  
→ Check server_id_long matches database ID

### Connection refused
→ Verify backend is running on port 8080

## Key Files
- `config.json` - Agent configuration
- `agent.log` - Agent logs
- `AGENT_INTEGRATION_GUIDE.md` - Full documentation

## Support
For detailed setup, see: `AGENT_INTEGRATION_GUIDE.md`
