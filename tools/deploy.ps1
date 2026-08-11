$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$scopedWranglerConfig = Join-Path $repoRoot '.cf-wrangler'
$env:XDG_CONFIG_HOME = $scopedWranglerConfig

Push-Location $repoRoot
try {
    $identity = npx wrangler whoami 2>&1 | Out-String
    if ($identity -notmatch 'flori@ai-rise\.ai') {
        throw 'Deployment refused: sign the scoped Wrangler session into flori@ai-rise.ai first.'
    }

    npx wrangler pages deploy public --project-name=proventus-finance --branch=main
    if ($LASTEXITCODE -ne 0) {
        throw "Wrangler deployment failed with exit code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
}
