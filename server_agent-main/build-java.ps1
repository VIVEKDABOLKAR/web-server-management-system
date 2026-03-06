Write-Host "Building Java Agent..." -ForegroundColor Green

$outDir = "out"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$sourceFiles = Get-ChildItem -Path "src/main/java" -Filter "*.java" -Recurse | ForEach-Object { $_.FullName }
if ($sourceFiles.Count -eq 0) {
    Write-Host "No Java source files found." -ForegroundColor Red
    exit 1
}

javac -d $outDir $sourceFiles

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "Build complete. Run with:" -ForegroundColor Green
Write-Host "java -cp out wsms.agent.Main" -ForegroundColor Yellow
