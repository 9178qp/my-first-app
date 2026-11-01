# build-ipa.ps1 —— 一条命令完成：建仓库 → 推代码 → 云端编译 → 下载 ipa
#
# 前提：已经 gh auth login 过（一次性）
# 用法： powershell -ExecutionPolicy Bypass -File .\scripts\build-ipa.ps1

$ErrorActionPreference = 'Stop'

$env:PATH = 'F:\iOSDev\gh\bin;F:\iOSDev\PortableGit\cmd;F:\iOSDev\node;' + $env:PATH

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $repoRoot

function Step($t) { Write-Host ""; Write-Host "=== $t ===" -ForegroundColor Cyan }

# 1. 检查登录
Step '检查 GitHub 登录状态'
$status = & gh auth status 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) { throw "还没登录 GitHub：$status" }
Write-Host $status

# 2. 确保仓库存在并推送
Step '创建仓库 / 推送代码'
$remote = & git remote 2>$null
if (-not $remote) {
    & gh repo create my-first-app --public --source . --remote origin --push --description "My first iOS app (Expo)"
    if ($LASTEXITCODE -ne 0) { throw '创建仓库失败' }
} else {
    & git add -A
    & git -c core.safecrlf=false commit -m "update" 2>$null
    & git push -u origin main
}

# 3. 触发构建
Step '触发云端编译'
& gh workflow run build-ipa.yml
Start-Sleep -Seconds 10
$runId = (& gh run list --workflow=build-ipa.yml --limit 1 --json databaseId --jq '.[0].databaseId').Trim()
Write-Host "run id = $runId"

# 4. 等结果
Step '编译中（约 10~15 分钟）'
& gh run watch $runId --exit-status --interval 30
$ok = ($LASTEXITCODE -eq 0)

if (-not $ok) {
    Write-Host '编译失败了，拉日志：' -ForegroundColor Red
    & gh run view $runId --log-failed
    throw '编译失败'
}

# 5. 下载产物
Step '下载 ipa'
Remove-Item -Recurse -Force .\artifact -ErrorAction SilentlyContinue
& gh run download $runId -n MyFirstApp-ipa -D .\artifact
$zip = Get-ChildItem .\artifact -Filter *.ipa -Recurse | Select-Object -First 1
if ($zip) {
    Copy-Item $zip.FullName .\app.ipa -Force
    Write-Host "已保存: $repoRoot\app.ipa  ($([math]::Round($zip.Length/1MB,1)) MB)" -ForegroundColor Green
} else {
    throw '没有找到 ipa 文件'
}

Write-Host ""
Write-Host "下一步：双击 接收ipa.cmd，用 iPhone Safari 打开窗口里的地址下载安装。" -ForegroundColor Yellow
