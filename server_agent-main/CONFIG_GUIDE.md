# Agent Configuration Guide

## Setup Steps

1. **Register a server in the WSMS frontend**
   - Login to the web dashboard
   - Click "Add Server" 
   - Fill in server details (name, IP, OS type, etc.)
   - Save the server

2. **Get the Server ID and Agent Token**
   - After creating the server, note down:
     - Server ID (shown in the server details)
     - Agent Token (displayed after creation or in server settings)

3. **Update config.json**
   - Open `config.json` in the agent directory
   - Update these fields:
     ```json
     {
       "server_id_long": <YOUR_SERVER_ID>,
       "auth_token": "<YOUR_AGENT_TOKEN>",
       "backend_url": "http://localhost:8080"
     }
     ```

4. **Build and run the agent**
   ```powershell
   # Build
   .\build-java.ps1
   
   # Or using Maven
   mvn clean compile
   
   # Run
   mvn exec:java
   ```

5. **Choose monitoring mode**
   - Option 1: Metrics collection (sends CPU, Memory, Disk usage to backend)
   - Option 2: Connection monitoring (monitors network connections)

6. **Verify connection**
   - Check the agent logs (`agent.log`)
   - Look for "✓ Metrics sent successfully to backend"
   - Check the dashboard to see real-time metrics

## Configuration Options

- **server_id_long**: Numeric server ID from the backend database
- **auth_token**: Authentication token for this agent (from server creation)
- **backend_url**: URL of the WSMS backend API (default: http://localhost:8080)
- **collection_interval**: How often to collect metrics in seconds (default: 10)
- **cpu_threshold**: CPU usage alert threshold percentage (default: 80)
- **memory_threshold**: Memory usage alert threshold percentage (default: 85)
- **disk_threshold**: Disk usage alert threshold percentage (default: 90)

## Troubleshooting

- If you see "Invalid agent token" errors, verify the token matches what's in the database
- If you see "Server not found" errors, verify the server_id_long is correct
- Make sure the backend is running on the configured backend_url
- Check firewall settings allow connections to port 8080
