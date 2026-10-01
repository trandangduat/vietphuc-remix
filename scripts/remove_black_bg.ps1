<#
.SYNOPSIS
    Removes black background from fashion piece assets and exports clean transparent PNG.
.EXAMPLE
    .\scripts\remove_black_bg.ps1 -InputPath "input.jpg" -OutputPath "output.png" -Threshold 10 -Feather 5
#>
param(
    [Parameter(Mandatory=$true)][string]$InputPath,
    [Parameter(Mandatory=$true)][string]$OutputPath,
    [int]$Threshold = 10,
    [int]$Feather = 5
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $InputPath)) {
    Write-Error "Input file not found: $InputPath"
    exit 1
}

$src = [System.Drawing.Bitmap]::FromFile($InputPath)
$w = $src.Width
$h = $src.Height
$dst = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$stride = $srcData.Stride
$bytes = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

$visited = New-Object bool[] ($w * $h)
$isBg = New-Object bool[] ($w * $h)
$queue = New-Object System.Collections.Generic.Queue[int]

for ($x = 0; $x -lt $w; $x++) {
    $q1 = $x; if (-not $visited[$q1]) { $visited[$q1] = $true; $queue.Enqueue($q1) }
    $q2 = ($h - 1) * $w + $x; if (-not $visited[$q2]) { $visited[$q2] = $true; $queue.Enqueue($q2) }
}
for ($y = 0; $y -lt $h; $y++) {
    $q1 = $y * $w; if (-not $visited[$q1]) { $visited[$q1] = $true; $queue.Enqueue($q1) }
    $q2 = $y * $w + ($w - 1); if (-not $visited[$q2]) { $visited[$q2] = $true; $queue.Enqueue($q2) }
}

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cy = [math]::Floor($curr / $w)
    $cx = $curr % $w
    $bOffset = $cy * $stride + $cx * 4
    $b = $bytes[$bOffset]
    $g = $bytes[$bOffset + 1]
    $r = $bytes[$bOffset + 2]
    $brightness = [math]::Max($r, [math]::Max($g, $b))

    if ($brightness -le $Threshold) {
        $isBg[$curr] = $true
        if ($cx -gt 0) { $n = $curr - 1; if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) } }
        if ($cx -lt $w - 1) { $n = $curr + 1; if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) } }
        if ($cy -gt 0) { $n = $curr - $w; if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) } }
        if ($cy -lt $h - 1) { $n = $curr + $w; if (-not $visited[$n]) { $visited[$n] = $true; $queue.Enqueue($n) } }
    }
}

$dstBytes = New-Object byte[] ($stride * $h)
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $curr = $y * $w + $x
        $offset = $y * $stride + $x * 4
        $b = $bytes[$offset]
        $g = $bytes[$offset + 1]
        $r = $bytes[$offset + 2]

        if ($isBg[$curr]) {
            $dstBytes[$offset] = 0
            $dstBytes[$offset + 1] = 0
            $dstBytes[$offset + 2] = 0
            $dstBytes[$offset + 3] = 0
        } else {
            $brightness = [math]::Max($r, [math]::Max($g, $b))
            $alpha = 255
            if ($brightness -lt ($Threshold + $Feather)) {
                $alpha = [int]([math]::Round(255 * (($brightness - $Threshold) / $Feather)))
                if ($alpha -lt 0) { $alpha = 0 }
                if ($alpha -gt 255) { $alpha = 255 }
            }
            $dstBytes[$offset] = $b
            $dstBytes[$offset + 1] = $g
            $dstBytes[$offset + 2] = $r
            $dstBytes[$offset + 3] = [byte]$alpha
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstBytes, 0, $dstData.Scan0, $dstBytes.Length)
$src.UnlockBits($srcData)
$dst.UnlockBits($dstData)
$src.Dispose()

$parentDir = Split-Path $OutputPath -Parent
if ($parentDir -and (-not (Test-Path $parentDir))) { New-Item -ItemType Directory -Force $parentDir | Out-Null }

$dst.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dst.Dispose()
Write-Output "Successfully saved transparent PNG: $OutputPath"
