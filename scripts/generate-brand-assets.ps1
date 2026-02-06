param(
    [string]$LogoPath = "logo.png"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Save-ScaledImage {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Image]$Source,
        [Parameter(Mandatory = $true)]
        [int]$Width,
        [Parameter(Mandatory = $true)]
        [int]$Height,
        [Parameter(Mandatory = $true)]
        [string]$OutputPath,
        [double]$Scale = 1.0,
        [System.Drawing.Color]$BackgroundColor = [System.Drawing.Color]::Transparent
    )

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.Clear($BackgroundColor)

    $fitScale = [Math]::Min($Width / $Source.Width, $Height / $Source.Height)
    $targetScale = $fitScale * $Scale
    $targetWidth = [int][Math]::Round($Source.Width * $targetScale)
    $targetHeight = [int][Math]::Round($Source.Height * $targetScale)
    $x = [int][Math]::Round(($Width - $targetWidth) / 2)
    $y = [int][Math]::Round(($Height - $targetHeight) / 2)

    $graphics.DrawImage($Source, $x, $y, $targetWidth, $targetHeight)

    $outputDir = Split-Path -Parent $OutputPath
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$logoFullPath = if ([System.IO.Path]::IsPathRooted($LogoPath)) { $LogoPath } else { Join-Path $root $LogoPath }

if (-not (Test-Path $logoFullPath)) {
    throw "Logo file not found: $logoFullPath"
}

$logo = [System.Drawing.Image]::FromFile($logoFullPath)
try {
    $androidResRoot = Join-Path $root "android/app/src/main/res"

    $launcherSizes = @{
        "mipmap-mdpi" = 48
        "mipmap-hdpi" = 72
        "mipmap-xhdpi" = 96
        "mipmap-xxhdpi" = 144
        "mipmap-xxxhdpi" = 192
    }

    foreach ($entry in $launcherSizes.GetEnumerator()) {
        $dir = Join-Path $androidResRoot $entry.Key
        Save-ScaledImage -Source $logo -Width $entry.Value -Height $entry.Value -OutputPath (Join-Path $dir "ic_launcher.png")
        Save-ScaledImage -Source $logo -Width $entry.Value -Height $entry.Value -OutputPath (Join-Path $dir "ic_launcher_round.png")
    }

    $foregroundSizes = @{
        "mipmap-mdpi" = 108
        "mipmap-hdpi" = 162
        "mipmap-xhdpi" = 216
        "mipmap-xxhdpi" = 324
        "mipmap-xxxhdpi" = 432
    }

    foreach ($entry in $foregroundSizes.GetEnumerator()) {
        $dir = Join-Path $androidResRoot $entry.Key
        Save-ScaledImage -Source $logo -Width $entry.Value -Height $entry.Value -Scale 0.82 -OutputPath (Join-Path $dir "ic_launcher_foreground.png")
    }

    $white = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
    $splashSpecs = @(
        @{ Dir = "drawable"; Width = 320; Height = 480 },
        @{ Dir = "drawable-port-mdpi"; Width = 320; Height = 480 },
        @{ Dir = "drawable-land-mdpi"; Width = 480; Height = 320 },
        @{ Dir = "drawable-port-hdpi"; Width = 480; Height = 720 },
        @{ Dir = "drawable-land-hdpi"; Width = 720; Height = 480 },
        @{ Dir = "drawable-port-xhdpi"; Width = 640; Height = 960 },
        @{ Dir = "drawable-land-xhdpi"; Width = 960; Height = 640 },
        @{ Dir = "drawable-port-xxhdpi"; Width = 960; Height = 1440 },
        @{ Dir = "drawable-land-xxhdpi"; Width = 1440; Height = 960 },
        @{ Dir = "drawable-port-xxxhdpi"; Width = 1280; Height = 1920 },
        @{ Dir = "drawable-land-xxxhdpi"; Width = 1920; Height = 1280 }
    )

    foreach ($spec in $splashSpecs) {
        $dir = Join-Path $androidResRoot $spec.Dir
        Save-ScaledImage -Source $logo -Width $spec.Width -Height $spec.Height -Scale 0.45 -BackgroundColor $white -OutputPath (Join-Path $dir "splash.png")
    }

    $publicIconsDir = Join-Path $root "public/icons"
    Save-ScaledImage -Source $logo -Width 192 -Height 192 -OutputPath (Join-Path $publicIconsDir "icon-192.png")
    Save-ScaledImage -Source $logo -Width 512 -Height 512 -OutputPath (Join-Path $publicIconsDir "icon-512.png")

    Write-Output "Brand assets generated successfully from: $logoFullPath"
}
finally {
    $logo.Dispose()
}
