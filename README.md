# WSMS

WSMS is a web server management system for monitoring servers, collecting metrics from agents, and viewing data in a web dashboard.

## What it includes
- Backend API for auth, servers, metrics, alerts, and admin features
- Frontend dashboard for user management and metrics visualization
- Java agent for collecting and sending server metrics

## Requirements
- Java 21
- Maven 3.8+
- MySQL 8+
- Node.js 18+

## Run the project

### 1. Create the database
```sql
CREATE DATABASE wsms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Start the backend
```bash
cd backend/wsms
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 3. Start the frontend
```bash
cd frontend/wsms
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Run the agent
Update `server_agent-main/config.json`, then run:
```bash
cd server_agent-main
mvn clean compile
mvn exec:java
```

## Main API endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/servers`
- `POST /api/servers`
- `PUT /api/servers/{id}`
- `DELETE /api/servers/{id}`
- `GET /api/metrics/server/{serverId}`
- `POST /api/agent/metrics`

## Notes
- Set backend database credentials in `backend/wsms/src/main/resources/application.properties`
- Set frontend API base URL in `frontend/wsms/src/services/api.js`
- Set agent server ID and token in `server_agent-main/config.json`
