param(
  [string]$RemoteUrl = "",
  [switch]$SkipTests,
  [switch]$SkipReinit
)

$ErrorActionPreference = 'Stop'

Set-Location -LiteralPath $PSScriptRoot

if (-not $SkipTests) {
  Write-Host "Running install and deployment checks..."
  npm install
  npm run lint
  npm run build
}

if ($SkipReinit) {
  Write-Host "Skipping Git reinitialization as requested."
  exit 0
}

$cleanupPaths = @(
  'package-lock.json',
  'plan.md',
  'dummy_products.sql',
  'utils/supabase',
  'Images'
)

foreach ($path in $cleanupPaths) {
  if (Test-Path -LiteralPath $path) {
    git rm -r --cached --force --ignore-unmatch -- $path
  }
}

if (Test-Path -LiteralPath '.git') {
  Remove-Item -Recurse -Force .git
}

git init
git branch -M main
git add -A
git commit -m "Initial clean deployment snapshot"

if ($RemoteUrl) {
  git remote add origin $RemoteUrl
  Write-Host "Remote added: $RemoteUrl"
}

Write-Host "Done. Review git status, then push when ready."
