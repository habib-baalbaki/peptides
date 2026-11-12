Add-Type -AssemblyName System.Drawing

function Build-Cover($srcPath, $destPath, [int]$targetW, [int]$targetH) {
    if (-not (Test-Path $srcPath)) {
        Write-Error "Source image not found: $srcPath"
        return
    }

    $srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)

    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Scale and draw source image to target dimensions
    $g.DrawImage($srcBmp, 0, 0, $targetW, $targetH)

    $scale = $targetW / 1376.0

    # Gradient overlay on left to ensure maximum readability of text
    $leftW = [int](790 * $scale)
    $rectLeft = New-Object System.Drawing.Rectangle(0, 0, $leftW, $targetH)
    $pt1 = New-Object System.Drawing.PointF(0, 0)
    $pt2 = New-Object System.Drawing.PointF($leftW, 0)
    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $pt1,
        $pt2,
        [System.Drawing.Color]::FromArgb(235, 8, 14, 25),
        [System.Drawing.Color]::FromArgb(0, 8, 14, 25)
    )
    $g.FillRectangle($gradBrush, $rectLeft)
    $gradBrush.Dispose()

    # Helper function to draw rounded rectangle
    function Draw-RoundedRectangle($graphics, $brush, $pen, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddArc($x, $y, ($r * 2), ($r * 2), 180, 90)
        $path.AddArc(($x + $w - $r * 2), $y, ($r * 2), ($r * 2), 270, 90)
        $path.AddArc(($x + $w - $r * 2), ($y + $h - $r * 2), ($r * 2), ($r * 2), 0, 90)
        $path.AddArc($x, ($y + $h - $r * 2), ($r * 2), ($r * 2), 90, 90)
        $path.CloseFigure()
        if ($brush) { $graphics.FillPath($brush, $path) }
        if ($pen) { $graphics.DrawPath($pen, $path) }
        $path.Dispose()
    }

    # 1. Top Category Pill: "CANADIAN-BASED RESEARCH PEPTIDES"
    $pillX = [float](80 * $scale)
    $pillY = [float](118 * $scale)
    $pillW = [float](370 * $scale)
    $pillH = [float](34 * $scale)
    $pillR = [float](17 * $scale)

    $pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 6, 182, 212))
    $pillBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 6, 182, 212), [float](1.5 * $scale))
    Draw-RoundedRectangle $g $pillBg $pillBorder $pillX $pillY $pillW $pillH $pillR
    $pillBg.Dispose(); $pillBorder.Dispose()

    $fontPill = New-Object System.Drawing.Font("Segoe UI", [float](11 * $scale), [System.Drawing.FontStyle]::Bold)
    $brushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
    $ptPill = New-Object System.Drawing.PointF([float](96 * $scale), [float](125 * $scale))
    $g.DrawString("•  CANADIAN-BASED RESEARCH PEPTIDES", $fontPill, $brushCyan, $ptPill)
    $fontPill.Dispose()

    # 2. Main Title: "NXT PEPTIDES"
    $fontTitle = New-Object System.Drawing.Font("Segoe UI Black", [float](46 * $scale), [System.Drawing.FontStyle]::Bold)
    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $ptTitle = New-Object System.Drawing.PointF([float](76 * $scale), [float](166 * $scale))
    $g.DrawString("NXT PEPTIDES", $fontTitle, $brushWhite, $ptTitle)
    $fontTitle.Dispose()

    # Sub-title: "C A N A D A"
    $fontSubTitle = New-Object System.Drawing.Font("Segoe UI", [float](22 * $scale), [System.Drawing.FontStyle]::Bold)
    $ptSubTitle = New-Object System.Drawing.PointF([float](82 * $scale), [float](242 * $scale))
    $g.DrawString("C  A  N  A  D  A", $fontSubTitle, $brushCyan, $ptSubTitle)
    $fontSubTitle.Dispose()

    # 3. Tagline: "Third-Party Tested by Janoshik Analytical (HPLC + MS)"
    $fontTagline = New-Object System.Drawing.Font("Segoe UI Semibold", [float](14 * $scale), [System.Drawing.FontStyle]::Bold)
    $brushGray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 203, 213, 225))
    $ptTagline = New-Object System.Drawing.PointF([float](82 * $scale), [float](294 * $scale))
    $g.DrawString("Third-Party Tested by Janoshik Analytical (HPLC + MS)", $fontTagline, $brushGray, $ptTagline)
    $fontTagline.Dispose()

    # 4. Feature Trust Badges
    $features = @(
        "Public Janoshik COAs matching the lot on your vial",
        "Fast domestic Canadian shipping via Xpresspost (no border delays)",
        "Free 3 mL Bacteriostatic Water included with every delivery"
    )

    $featFont = New-Object System.Drawing.Font("Segoe UI", [float](13 * $scale), [System.Drawing.FontStyle]::Bold)
    $featSubFont = New-Object System.Drawing.Font("Segoe UI", [float](12.5 * $scale), [System.Drawing.FontStyle]::Regular)
    $brushEmerald = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))

    for ($i = 0; $i -lt $features.Count; $i++) {
        $fy = [float]((348 + ($i * 44)) * $scale)
        $fBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(85, 17, 24, 39))
        $fBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 51, 65, 85), [float](1 * $scale))
        Draw-RoundedRectangle $g $fBg $fBorder ([float](80 * $scale)) $fy ([float](570 * $scale)) ([float](36 * $scale)) ([float](8 * $scale))
        $fBg.Dispose(); $fBorder.Dispose()

        # Checkmark
        $ptI = New-Object System.Drawing.PointF([float](94 * $scale), [float]($fy + (7 * $scale)))
        $g.DrawString("✓", $featFont, $brushEmerald, $ptI)
        # Text
        $ptT = New-Object System.Drawing.PointF([float](120 * $scale), [float]($fy + (7 * $scale)))
        $g.DrawString($features[$i], $featSubFont, $brushWhite, $ptT)
    }
    $featFont.Dispose(); $featSubFont.Dispose(); $brushEmerald.Dispose()

    # 5. Website CTA Button
    $btnX = [float](80 * $scale)
    $btnY = [float](502 * $scale)
    $btnW = [float](270 * $scale)
    $btnH = [float](50 * $scale)
    $btnR = [float](12 * $scale)

    $btnPt1 = New-Object System.Drawing.PointF($btnX, $btnY)
    $btnPt2 = New-Object System.Drawing.PointF(($btnX + $btnW), ($btnY + $btnH))
    $btnGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $btnPt1,
        $btnPt2,
        [System.Drawing.Color]::FromArgb(255, 6, 182, 212),
        [System.Drawing.Color]::FromArgb(255, 37, 99, 235)
    )
    Draw-RoundedRectangle $g $btnGrad $null $btnX $btnY $btnW $btnH $btnR
    $btnGrad.Dispose()

    $fontBtn = New-Object System.Drawing.Font("Segoe UI Black", [float](16 * $scale), [System.Drawing.FontStyle]::Bold)
    $ptBtn = New-Object System.Drawing.PointF([float]($btnX + (30 * $scale)), [float]($btnY + (10 * $scale)))
    $g.DrawString("nxtcanada.ca", $fontBtn, $brushWhite, $ptBtn)
    $fontBtn.Dispose()

    # Next to button: 20% off code
    $fontCode = New-Object System.Drawing.Font("Segoe UI", [float](12 * $scale), [System.Drawing.FontStyle]::Bold)
    $brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
    $ptCode = New-Object System.Drawing.PointF([float](375 * $scale), [float](508 * $scale))
    $g.DrawString("20% OFF FIRST ORDER", $fontCode, $brushGold, $ptCode)

    $fontCodeSmall = New-Object System.Drawing.Font("Segoe UI", [float](11 * $scale), [System.Drawing.FontStyle]::Regular)
    $ptCodeSmall = New-Object System.Drawing.PointF([float](375 * $scale), [float](530 * $scale))
    $g.DrawString("Use Code: WELCOME at checkout", $fontCodeSmall, $brushGray, $ptCodeSmall)
    $fontCode.Dispose(); $fontCodeSmall.Dispose(); $brushGold.Dispose()

    # 6. Compliance line
    $fontComp = New-Object System.Drawing.Font("Segoe UI", [float](9.5 * $scale), [System.Drawing.FontStyle]::Regular)
    $brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 148, 163, 184))
    $ptComp = New-Object System.Drawing.PointF([float](80 * $scale), [float](580 * $scale))
    $g.DrawString("Strictly for laboratory research use only. Not for human or animal consumption.", $fontComp, $brushMuted, $ptComp)
    $fontComp.Dispose(); $brushMuted.Dispose()

    # Clean up
    $brushCyan.Dispose(); $brushWhite.Dispose(); $brushGray.Dispose()
    $g.Dispose()
    $srcBmp.Dispose()

    # Save output
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 96L)
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

    $bmp.Save($destPath, $jpegCodec, $encoderParams)
    $bmp.Dispose()

    Write-Output "Generated: $destPath ($targetW x $targetH)"
}

$src = "c:\Users\Habib\projects\peptides\social-media\facebook-cover-v2.jpg"

# 1. Native Resolution 1376x768
Build-Cover $src "c:\Users\Habib\projects\peptides\social-media\facebook-cover-branded.jpg" 1376 768

# 2. Facebook High-Res Standard 1640x924
Build-Cover $src "c:\Users\Habib\projects\peptides\social-media\facebook-cover-1640x924.jpg" 1640 924

# 3. Also update assets/img/facebook-cover.jpg so the website has the official branded cover
Build-Cover $src "c:\Users\Habib\projects\peptides\assets\img\facebook-cover.jpg" 1640 924
