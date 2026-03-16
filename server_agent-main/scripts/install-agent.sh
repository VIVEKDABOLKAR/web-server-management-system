#!/usr/bin/env bash
set -e

JAR_URL="$1"
SERVER_ID="$2"
AGENT_TOKEN="$3"
BACKEND_URL="$4"

mkdir -p /opt/wsms-agent
curl -fsSL "$JAR_URL" -o /opt/wsms-agent/server-agent.jar

cat > /opt/wsms-agent/config.json <<EOF
{"serverId":"$SERVER_ID","serverName":"server-$SERVER_ID","authToken":"$AGENT_TOKEN","backendUrl":"$BACKEND_URL","collectionInterval":"PT5S"}
EOF

nohup java -jar /opt/wsms-agent/server-agent.jar --configPath=/opt/wsms-agent/config.json > /opt/wsms-agent/agent.out 2>&1 &
echo "Agent started. PID: $!"
