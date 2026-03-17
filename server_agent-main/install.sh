#!/bin/bash
# WSMS Agent Install Script (runs ON the EC2 server)
# Usage: ./install.sh <SERVER_ID> <AGENT_TOKEN> <BACKEND_URL>
set -e

SERVER_ID="${1:-}"
AGENT_TOKEN="${2:-}"
BACKEND_URL="${3:-http://localhost:8080}"
INSTALL_DIR="/opt/wsms-agent"
JAR_NAME="wsms-agent.jar"
SERVICE_NAME="wsms-agent"

# ── Validate arguments ─────────────────────────────────────────────────────────
if [ -z "$SERVER_ID" ] || [ -z "$AGENT_TOKEN" ]; then
  echo "Usage: $0 <SERVER_ID> <AGENT_TOKEN> <BACKEND_URL>"
  exit 1
fi

echo "=== WSMS Agent Installer ==="
echo "Server ID   : $SERVER_ID"
echo "Backend URL : $BACKEND_URL"
echo ""

# ── Install Java 21 if missing ─────────────────────────────────────────────────
if ! java -version 2>&1 | grep -q "21\|22\|23\|24"; then
  echo "[1/5] Installing Java 21..."
  sudo apt-get update -qq
  sudo apt-get install -y openjdk-21-jre-headless
else
  echo "[1/5] Java already installed: $(java -version 2>&1 | head -1)"
fi

# ── Create install directory ───────────────────────────────────────────────────
echo "[2/5] Creating install directory $INSTALL_DIR ..."
sudo mkdir -p "$INSTALL_DIR"
sudo chown ubuntu:ubuntu "$INSTALL_DIR"

# ── Copy JAR (expects it to be in the same directory as this script) ───────────
echo "[3/5] Copying agent JAR..."
if [ -f "$JAR_NAME" ]; then
  cp "$JAR_NAME" "$INSTALL_DIR/$JAR_NAME"
else
  echo "ERROR: $JAR_NAME not found in current directory."
  echo "Run deploy.ps1 from your local machine first."
  exit 1
fi

# ── Write config.json ──────────────────────────────────────────────────────────
echo "[4/5] Writing config.json..."
cat > "$INSTALL_DIR/config.json" <<EOF
{
  "server_id_long": $SERVER_ID,
  "auth_token": "$AGENT_TOKEN",
  "backend_url": "$BACKEND_URL",
  "websocket_url": "$BACKEND_URL",
  "collection_interval": 10,
  "enable_cpu": true,
  "enable_memory": true,
  "enable_disk": true,
  "enable_network": false,
  "enable_web_server": true,
  "enable_alerts": true,
  "enable_ip_blocking": false,
  "enable_backup": false,
  "cpu_threshold": 80.0,
  "memory_threshold": 85.0,
  "disk_threshold": 90.0,
  "log_level": "info",
  "log_file": "/opt/wsms-agent/agent.log"
}
EOF

# ── Create systemd service ─────────────────────────────────────────────────────
echo "[5/5] Installing systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=WSMS Monitoring Agent
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/java -jar $INSTALL_DIR/$JAR_NAME $INSTALL_DIR/config.json
Restart=on-failure
RestartSec=10
StandardOutput=append:$INSTALL_DIR/agent.log
StandardError=append:$INSTALL_DIR/agent.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart $SERVICE_NAME

echo ""
echo "=== Installation Complete ==="
echo "Service status:"
sudo systemctl status $SERVICE_NAME --no-pager
echo ""
echo "Tail logs with:"
echo "  tail -f $INSTALL_DIR/agent.log"
