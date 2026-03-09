# Web Server Management System (WSMS) - Monitoring Agent

A lightweight, enterprise-grade Java monitoring agent designed for real-time server performance tracking and network traffic monitoring. This agent collects system metrics, monitors network connections, and maintains comprehensive logs for server infrastructure management.

## 🎯 What Does This Agent Do?

The WSMS Agent is a Java-based system monitoring tool that provides two primary operational modes:

### 1. **Metrics Collection Mode** (Default)
Continuously monitors and logs server performance metrics at configurable intervals:
- **CPU Usage**: Real-time processor utilization percentage
- **Memory Usage**: RAM consumption and availability
- **Disk Usage**: Storage utilization for specified partitions
- **Network Information**: Primary IPv4 address detection and logging
- **Timestamp Tracking**: All metrics are timestamped for historical analysis

### 2. **Connection Monitor Mode** (TCP Proxy)
Acts as a TCP proxy that monitors and logs incoming network connections:
- Listens on a specified port for incoming connections
- Logs detailed connection information (client IP, timestamp, destination)
- Forwards traffic to `localhost:5173` (configurable target)
- Useful for tracking web server access patterns and debugging network traffic

## 🏗️ Project Architecture

```
server_agent-main/
├── pom.xml                          # Maven project configuration
├── build-java.ps1                   # PowerShell build script
├── README.md                        # This file
│
└── src/
    ├── main/java/wsms/agent/
    │   ├── Main.java                # Application entry point
    │   │
    │   ├── core/
    │   │   └── Agent.java           # Main agent orchestration logic
    │   │
    │   ├── config/
    │   │   └── Config.java          # Configuration management
    │   │
    │   ├── collector/
    │   │   ├── CPUCollector.java    # CPU metrics collection
    │   │   ├── MemoryCollector.java # Memory metrics collection
    │   │   └── DiskCollector.java   # Disk metrics collection
    │   │
    │   ├── model/
    │   │   ├── Metrics.java         # Metrics data model
    │   │   ├── IPInfo.java          # IP information model
    │   │   └── RequestLog.java      # Connection log model
    │   │
    │   ├── network/
    │   │   ├── IPUtils.java         # Network utilities (IP detection)
    │   │   └── ConnectionMonitor.java # TCP proxy and connection logging
    │   │
    │   └── utils/
    │       └── Logger.java          # Dual-output logging (console + file)
    │
    └── test/java/wsms/agent/        # Comprehensive test suite (122 tests)
        ├── collector/               # Collector tests (31 tests)
        ├── config/                  # Configuration tests (20 tests)
        ├── model/                   # Model tests (40 tests)
        ├── network/                 # Network tests (15 tests)
        └── utils/                   # Utility tests (16 tests)
```

## 📋 Prerequisites

- **Java Development Kit (JDK)**: Version 17 or higher
- **Maven**: Version 3.6+ (for dependency management)
- **PowerShell**: For build script execution (Windows)
- **Operating System**: Windows, Linux, or macOS

## 🚀 Quick Start

### Building the Project

**Option 1: Using PowerShell Script**
```powershell
./build-java.ps1
```

**Option 2: Using Maven**
```bash
mvn clean compile
```

**Option 3: Using Maven with Tests**
```bash
mvn clean test
```

### Running the Agent

**Default Configuration:**
```bash
mvn exec:java
```

**Custom Configuration:**
```bash
mvn exec:java -Dexec.args="custom-config.json"
```

**Direct Java Execution:**
```bash
# After building
java -cp target/classes wsms.agent.Main [optional-config-path]
```

## ⚙️ Configuration

The agent uses a JSON configuration file (default: `config.json`). If not found, it uses sensible defaults.

**Example Configuration:**
```json
{
  "serverId": "server-001",
  "collectionInterval": 30,
  "logFile": "agent.log",
  "targetHost": "localhost",
  "targetPort": 5173
}
```

**Configuration Options:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `serverId` | String | `"default-server"` | Unique identifier for this server |
| `collectionInterval` | Integer | `30` | Metrics collection interval (seconds) |
| `logFile` | String | `"agent.log"` | Log file path |
| `targetHost` | String | `"localhost"` | Target host for connection forwarding |
| `targetPort` | Integer | `5173` | Target port for connection forwarding |

## 🎮 Interactive Mode Selection

When you start the agent, you'll see:

```
Choose an option:
1. Start collecting metrics
2. Start monitoring incoming connections
```

### Option 1: Metrics Collection
Monitors system resources and logs them at regular intervals.

**Output Example:**
```
========================================
Time: 2026-03-05T10:30:45.123Z
Server: server-001
CPU Usage: 45.32%
Memory Usage: 68.50%
Disk Usage: 72.15%
Primary IP Address: [192.168.1.100, 10.0.0.5]
========================================
```

### Option 2: Connection Monitor
Prompts for a port number and starts monitoring incoming TCP connections.

**Output Example:**
```
Enter port to monitor: 8080
Starting connection monitor on port 8080... to the port 5173
========================================
INCOMING CONNECTION DETECTED
Time: 2026-03-05T10:35:12.456Z
Client IP: 192.168.1.50
Destination: /192.168.1.100:8080
========================================
```

## 🧪 Testing

The project includes a comprehensive test suite with **122 unit tests** covering all components.

**Run All Tests:**
```bash
mvn test
```

**Test Summary:**
- ✅ CPUCollectorTest: 7 tests
- ✅ DiskCollectorTest: 14 tests  
- ✅ MemoryCollectorTest: 10 tests
- ✅ ConfigTest: 20 tests
- ✅ IPInfoTest: 11 tests
- ✅ MetricsTest: 13 tests
- ✅ RequestLogTest: 16 tests
- ✅ IPUtilsTest: 15 tests
- ✅ LoggerTest: 16 tests

**All tests passing with 0 failures!**

## 📊 Logging

The agent uses a dual-output logging system:
- **Console Output**: Real-time monitoring
- **File Output**: Persistent logs in `agent.log` (default)

Logs include:
- Agent startup and shutdown events
- Metrics collection results
- Connection monitoring events
- Error messages and warnings
- System IP addresses

**Log Levels:**
- INFO: General information and metrics
- ERROR: System errors and exceptions

## 🔧 Technical Details

**Key Features:**
- **Multi-threaded**: Connection monitoring uses thread pools for concurrent handling
- **Graceful Shutdown**: Proper cleanup via shutdown hooks
- **Resource Management**: Automatic resource cleanup and connection closing
- **Cross-platform**: Works on Windows, Linux, and macOS
- **Configurable**: JSON-based configuration with fallback defaults
- **Well-tested**: High test coverage with JUnit 5 and Mockito

**Technologies Used:**
- Java 21 (configurable to Java 17+)
- JUnit 5 for testing
- Mockito for mocking
- Maven for build management
- Java Management Extensions (JMX) for system metrics
- Java NIO for network operations

## 🛠️ Development Setup

**Building with Maven:**
```bash
# Compile only
mvn compile

# Run tests
mvn test

# Package (creates JAR)
mvn package

# Clean build artifacts
mvn clean
```

**Project Dependencies:**
- JUnit Jupiter 5.10.2 (testing)
- Mockito 5.11.0 (mocking framework)

## 📝 Use Cases

1. **Server Health Monitoring**: Track CPU, memory, and disk usage over time
2. **Infrastructure Management**: Monitor multiple servers with unique server IDs
3. **Network Traffic Analysis**: Log and analyze incoming connections
4. **Development Debugging**: Use as a proxy to inspect web server traffic
5. **Capacity Planning**: Historical metrics for infrastructure scaling decisions
6. **Incident Response**: Log files provide audit trail for troubleshooting

## 🤝 Contributing

The project follows standard Java conventions:
- Package structure: `wsms.agent.*`
- Code style: Standard Java naming conventions
- Testing: JUnit 5 with minimum 80% coverage maintained

## 📄 License

This project is part of the Web Server Management System (WSMS) suite.

## 🔍 Troubleshooting

**Common Issues:**

1. **Port Already in Use**
   - Solution: Choose a different port or stop the conflicting service

2. **Permission Denied (Port < 1024)**
   - Solution: Use ports > 1024 or run with elevated privileges

3. **Config File Not Found**
   - Solution: Agent will use defaults; create `config.json` if customization needed

4. **High CPU Usage on Windows**
   - Note: CPU monitoring may take a few seconds on initial measurement

## 📈 Performance

- **CPU Collection**: ~1-10 seconds (initial measurement may be slower)
- **Memory Collection**: < 100ms
- **Disk Collection**: < 200ms
- **IP Detection**: < 500ms
- **Connection Handling**: Non-blocking, concurrent connections supported

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Maintainer**: WSMS Development Team
