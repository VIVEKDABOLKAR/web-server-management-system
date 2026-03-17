# WSMS Agent Deploy Script (run from backend/wsms)
# Builds the agent from the repository agent project, copies it to EC2, and installs it.

param(
    [Parameter(Mandatory=$true)]  [string]$ServerId,
    [Parameter(Mandatory=$true)]  [string]$AgentToken,
    [Parameter(Mandatory=$false)] [string]$BackendUrl = "http://localhost:8080",
    [Parameter(Mandatory=$false)] [string]$SshUser = "ubuntu",
    [Parameter(Mandatory=$false)] [string]$SshHost = "ec2-13-53-42-206.eu-north-1.compute.amazonaws.com",
    [Parameter(Mandatory=$false)] [string]$KeyFile = "D:\project\web-server-management-system\keys\key.pem"
)

$BackendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent (Split-Path -Parent $BackendDir)
$AgentProjectDir = Join-Path $RepoRoot "server_agent-main"
$JarSource = Join-Path $AgentProjectDir "target\wsms-agent.jar"
$InstallSh = Join-Path $AgentProjectDir "install.sh"
$RemoteHome = "/home/$SshUser"

Write-Host "=== WSMS Agent Deployment ===" -ForegroundColor Cyan
Write-Host "Backend folder : $BackendDir" -ForegroundColor Gray
Write-Host "Agent source   : $AgentProjectDir" -ForegroundColor Gray
Write-Host "Target         : $SshUser@$SshHost" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $AgentProjectDir)) {
    Write-Error "Agent project not found at $AgentProjectDir"
    exit 1
}

Write-Host "[1/4] Building agent JAR..." -ForegroundColor Yellow
Push-Location $AgentProjectDir
mvn package -q --no-transfer-progress
Pop-Location

if (-not (Test-Path $JarSource)) {
    Write-Error "Build failed: $JarSource not found."
    exit 1
}

Write-Host "[2/4] Copying files to EC2..." -ForegroundColor Yellow
scp -i "$KeyFile" -o StrictHostKeyChecking=no "$JarSource" "${SshUser}@${SshHost}:${RemoteHome}/wsms-agent.jar"
scp -i "$KeyFile" -o StrictHostKeyChecking=no "$InstallSh" "${SshUser}@${SshHost}:${RemoteHome}/install.sh"

Write-Host "[3/4] Making install script executable..." -ForegroundColor Yellow
ssh -i "$KeyFile" -o StrictHostKeyChecking=no "${SshUser}@${SshHost}" "chmod +x ~/install.sh"

Write-Host "[4/4] Running installer on EC2..." -ForegroundColor Yellow
ssh -i "$KeyFile" -o StrictHostKeyChecking=no "${SshUser}@${SshHost}" "~/install.sh '$ServerId' '$AgentToken' '$BackendUrl'"

Write-Host ""
Write-Host "Deployment complete." -ForegroundColor Green
