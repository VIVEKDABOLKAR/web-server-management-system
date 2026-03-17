# WSMS Agent Deploy Script (runs on YOUR local Windows machine)
# Builds the fat JAR, SCPs it to EC2, and runs install.sh remotely.
#
# Usage:
#   .\deploy.ps1 -ServerId 3 -AgentToken "uuid-here" -BackendUrl "http://your-backend:8080"
#
# All parameters are optional if you set defaults below.

param(
    [Parameter(Mandatory=$true)]  [string]$ServerId,
    [Parameter(Mandatory=$true)]  [string]$AgentToken,
    [Parameter(Mandatory=$false)] [string]$BackendUrl   = "http://localhost:8080",
    [Parameter(Mandatory=$false)] [string]$SshUser      = "ubuntu",
    [Parameter(Mandatory=$false)] [string]$SshHost      = "ec2-13-53-42-206.eu-north-1.compute.amazonaws.com",
    [Parameter(Mandatory=$false)] [string]$KeyFile      = "D:\project\web-server-management-system\keys\key.pem"
)

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$JarSource   = Join-Path $ScriptDir "target\wsms-agent.jar"
$InstallSh   = Join-Path $ScriptDir "install.sh"
$RemoteHome  = "/home/$SshUser"

Write-Host "=== WSMS Agent Deployment ===" -ForegroundColor Cyan
Write-Host "Target   : $SshUser@$SshHost" -ForegroundColor Gray
Write-Host "Server ID: $ServerId" -ForegroundColor Gray
Write-Host "Backend  : $BackendUrl" -ForegroundColor Gray
Write-Host ""

# ── Step 1: Build fat JAR ─────────────────────────────────────────────────────
Write-Host "[1/4] Building agent JAR..." -ForegroundColor Yellow
Push-Location $ScriptDir
mvn package -q --no-transfer-progress
Pop-Location

if (-not (Test-Path $JarSource)) {
    Write-Error "Build failed: $JarSource not found."
    exit 1
}
Write-Host "      Built: $JarSource" -ForegroundColor Green

# ── Step 2: SCP files to EC2 ──────────────────────────────────────────────────
Write-Host "[2/4] Copying files to EC2..." -ForegroundColor Yellow
scp -i "$KeyFile" -o StrictHostKeyChecking=no "$JarSource"  "${SshUser}@${SshHost}:${RemoteHome}/wsms-agent.jar"
scp -i "$KeyFile" -o StrictHostKeyChecking=no "$InstallSh"  "${SshUser}@${SshHost}:${RemoteHome}/install.sh"
Write-Host "      Files copied." -ForegroundColor Green

# ── Step 3: Make install.sh executable on EC2 ─────────────────────────────────
Write-Host "[3/4] Setting permissions on EC2..." -ForegroundColor Yellow
ssh -i "$KeyFile" -o StrictHostKeyChecking=no "${SshUser}@${SshHost}" "chmod +x ~/install.sh"

# ── Step 4: Run install.sh on EC2 ─────────────────────────────────────────────
Write-Host "[4/4] Running install script on EC2..." -ForegroundColor Yellow
ssh -i "$KeyFile" -o StrictHostKeyChecking=no "${SshUser}@${SshHost}" "~/install.sh '$ServerId' '$AgentToken' '$BackendUrl'"

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host "View live logs:" -ForegroundColor Gray
Write-Host "  ssh -i `"$KeyFile`" $SshUser@$SshHost `"tail -f /opt/wsms-agent/agent.log`""
