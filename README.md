# 🖥️ Web Server Management System (WSMS)

A comprehensive full-stack monitoring solution for real-time server performance tracking and management. Monitor CPU, memory, disk usage, and network metrics across multiple servers with an intuitive web interface.

## 📋 Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Agent (Java)   │ ─HTTP─→ │  Backend (API)   │ ←─HTTP─ │ Frontend (React) │
│  Collects Data  │         │  Stores Metrics  │         │ Displays Metrics │
└─────────────────┘         └──────────────────┘         └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- ☕ Java 21
- 📦 Maven 3.8+
- 🗄️ MySQL 8.0+
- 📦 Node.js 18+ & npm

### 1. Setup MySQL Database

```sql
CREATE DATABASE wsms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure & Run Backend

```bash
cd backend/wsms

# Update database credentials in src/main/resources/application.properties
# spring.datasource.username=root
# spring.datasource.password=your_password

mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 3. Setup & Run Frontend

```bash
cd frontend/wsms
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Register a Server

1. Open `http://localhost:5173`
2. Sign up / Login
3. Click **"+ Add Server"**
4. Fill in server details
5. **Copy the Server ID and Agent Token** shown after creation

### 5. Configure & Run Agent

Edit `server_agent-main/config.json`:

```json
{
  "server_id_long": YOUR_SERVER_ID,
  "auth_token": "YOUR_AGENT_TOKEN",
  "backend_url": "http://localhost:8080",
  "collection_interval": 10
}
```

Run the agent:

```bash
cd server_agent-main
mvn clean compile
mvn exec:java
```

Select **Option 1** (Metrics Collection Mode)

### 6. View Metrics

- Navigate to Dashboard
- Click on your server
- View real-time metrics with auto-refresh! 🎉

## 📁 Project Structure

```
wsms/
├── backend/wsms/              # Spring Boot Backend (Java 21)
│   ├── src/main/java/com/wsms/
│   │   ├── controller/        # REST API endpoints
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── entity/            # JPA entities
│   │   ├── dto/               # Data transfer objects
│   │   ├── security/          # JWT authentication
│   │   └── exception/         # Error handling
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/wsms/             # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service
│   │   └── context/           # React context
│   └── package.json
│
├── server_agent-main/         # Monitoring Agent (Java 21)
│   ├── src/main/java/wsms/agent/
│   │   ├── collector/         # System metrics collectors
│   │   ├── network/           # Network utilities
│   │   ├── model/             # Data models
│   │   └── core/              # Agent core logic
│   ├── config.json            # Agent configuration
│   └── pom.xml
│
└── database_optimization.sql  # MySQL optimization queries
```

## 🔧 Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA (Hibernate)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

### Agent
- **Language**: Java 21
- **HTTP Client**: HttpURLConnection
- **JSON**: Gson
- **Build**: Maven

## 📊 Features

### Backend API
- ✅ User authentication (JWT)
- ✅ Server management (CRUD)
- ✅ Agent authentication (token-based)
- ✅ Real-time metrics collection
- ✅ Automatic data retention (30 days)
- ✅ Alert system for performance issues
- ✅ IP blocking for security

### Frontend Dashboard
- ✅ User login/signup
- ✅ Server list with status indicators
- ✅ Real-time metrics visualization
- ✅ Time range filters (1h, 6h, 24h, 7d)
- ✅ Alert notifications
- ✅ Dark mode support
- ✅ Responsive design

### Monitoring Agent
- ✅ CPU usage monitoring
- ✅ Memory usage tracking
- ✅ Disk usage monitoring
- ✅ Network connection logging
- ✅ Configurable collection intervals
- ✅ Automatic metric submission to backend
- ✅ TCP proxy mode for connection monitoring

## 🗄️ Database Optimization

The system includes automatic data retention management to prevent unlimited database growth:

- **Auto-cleanup**: Runs daily at 2:00 AM
- **Retention period**: 30 days (configurable)
- **Configuration**: `application.properties`

```properties
app.metrics.retention-days=30
```

### Manual Optimization

Run the included SQL scripts for performance tuning:

```bash
mysql -u root -p wsms < database_optimization.sql
```

This creates indexes for:
- Fast server-based queries
- Efficient time-range filtering
- Optimized status filtering

## 🔐 Security

- **JWT Authentication**: Secure user sessions
- **Agent Token**: Unique token per server for agent authentication
- **Password Hashing**: BCrypt encryption
- **CORS Protection**: Configured allowed origins
- **IP Blocking**: Manual blocking of suspicious IPs

## 📡 API Endpoints

### Agent Endpoints (No JWT required, token-based)
- `POST /api/agent/metrics` - Submit metrics from agent

### Metrics Endpoints
- `GET /api/metrics/server/{serverId}` - Get metrics for a server
- `GET /api/metrics/server/{serverId}/range` - Get metrics with time filter

### Server Management
- `GET /api/servers` - List all user's servers
- `POST /api/servers` - Add new server
- `PUT /api/servers/{id}` - Update server
- `DELETE /api/servers/{id}` - Delete server

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

## ⚙️ Configuration

### Backend (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/wsms
spring.datasource.username=root
spring.datasource.password=root

# JWT
app.jwt.secret=YOUR_SECRET_KEY
app.jwt.expiration-ms=86400000

# Metrics retention (days)
app.metrics.retention-days=30

# CORS
app.cors.allowed-origins=http://localhost:5173
```

### Frontend (`src/services/api.js`)
```javascript
const API = axios.create({
  baseURL: 'http://localhost:8080'
});
```

### Agent (`config.json`)
```json
{
  "server_id_long": 1,
  "auth_token": "your-agent-token",
  "backend_url": "http://localhost:8080",
  "collection_interval": 10,
  "disk_path": "C:\\"
}
```

## 🐛 Troubleshooting

### Agent Issues

**"Invalid agent token"**
- Verify token in `config.json` matches the token from server registration
- Check server ID is correct

**"Connection refused"**
- Ensure backend is running on port 8080
- Check firewall settings

**"Server not found"**
- Confirm `server_id_long` matches the database ID

### Backend Issues

**Database connection error**
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database `wsms` exists

**Port 8080 already in use**
- Stop other services using port 8080
- Or change port in `application.properties`: `server.port=8081`

### Frontend Issues

**API connection error**
- Verify backend URL in `src/services/api.js`
- Check CORS configuration in backend

**Login fails**
- Clear browser localStorage
- Verify backend is running

## 📈 Monitoring Best Practices

1. **Collection Interval**: 
   - 10 seconds: High-frequency monitoring (recommended for critical servers)
   - 30-60 seconds: Normal monitoring
   - 5 minutes: Low-frequency monitoring

2. **Data Retention**:
   - 7 days: Minimal storage
   - 30 days: Recommended balance
   - 90 days: Extended history

3. **Database Maintenance**:
   - Run `OPTIMIZE TABLE metrics;` monthly
   - Monitor database size regularly
   - Adjust retention based on storage capacity

## 📝 Development

### Build Backend
```bash
cd backend/wsms
mvn clean package
java -jar target/wsms-0.0.1-SNAPSHOT.jar
```

### Build Frontend
```bash
cd frontend/wsms
npm run build
# Output in dist/
```

### Build Agent
```bash
cd server_agent-main
mvn clean package
java -jar target/server-agent-1.0-SNAPSHOT.jar
```

## 📄 License

This project is for educational and internal use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ☕ using Java 21, Spring Boot, React, and MySQL
