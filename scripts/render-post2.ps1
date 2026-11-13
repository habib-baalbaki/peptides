Add-Type -AssemblyName System.Drawing

$targetW = 1080
$targetH = 1080
$destPath = "c:\Users\Habib\projects\peptides\social-media\post2_purity_testing.jpg"

$bmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Background: Deep rich dark slate gradient
$rectFull = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.PointF(0, 0)),
    (New-Object System.Drawing.PointF($targetW, $targetH)),
    [System.Drawing.Color]::FromArgb(255, 10, 15, 26),
    [System.Drawing.Color]::FromArgb(255, 17, 24, 39)
)
$g.FillRectangle($bgBrush, $rectFull)
$bgBrush.Dispose()

# Subtle glowing cyan accent
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(650, -150, 600, 600)
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(45, 6, 182, 212)
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 10, 15, 26))
$g.FillPath($glowBrush, $glowPath)
$glowBrush.Dispose()
$glowPath.Dispose()

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

# 1. Top Category Pill: "🇨🇦 INDEPENDENT LABORATORY TESTING"
$pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 6, 182, 212))
$pillBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 6, 182, 212), 2)
Draw-RoundedRectangle $g $pillBg $pillBorder 80 75 480 44 22
$pillBg.Dispose(); $pillBorder.Dispose()

$fontPill = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$brushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
$g.DrawString("•  INDEPENDENT LABORATORY TESTING", $fontPill, $brushCyan, 106, 86)
$fontPill.Dispose()

# 2. Main Title: "HOW WE VERIFY PURITY"
$fontTitle = New-Object System.Drawing.Font("Segoe UI Black", 42, [System.Drawing.FontStyle]::Bold)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString("HOW WE VERIFY", $fontTitle, $brushWhite, 76, 140)
$brushEmerald = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))
$g.DrawString("PEPTIDE PURITY", $fontTitle, $brushEmerald, 76, 215)
$fontTitle.Dispose()

# Subtitle
$fontSub = New-Object System.Drawing.Font("Segoe UI Semibold", 17, [System.Drawing.FontStyle]::Bold)
$brushGray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 203, 213, 225))
$g.DrawString("Tested by Janoshik Analytical (HPLC + Mass Spectrometry)", $fontSub, $brushGray, 80, 305)
$fontSub.Dispose()

# 3. Three Analytical Cards
$cards = @(
    @{
        Title = "1. HPLC Analysis (Purity)";
        Desc = "High-Performance Liquid Chromatography separates every compound to measure exact purity percentage and confirm target peak area.";
        Badge = "PURITY CHECK";
        Color = [System.Drawing.Color]::FromArgb(255, 56, 189, 248)
    },
    @{
        Title = "2. Mass Spectrometry (Identity)";
        Desc = "Confirms the exact molecular mass and amino acid sequence of the peptide, verifying that you receive the real compound, not a substitute.";
        Badge = "IDENTITY VERIFIED";
        Color = [System.Drawing.Color]::FromArgb(255, 52, 211, 153)
    },
    @{
        Title = "3. Public Janoshik Verification";
        Desc = "Every batch report includes a unique verification task ID you can check directly on Janoshik's official laboratory database.";
        Badge = "PUBLIC COA";
        Color = [System.Drawing.Color]::FromArgb(255, 251, 191, 36)
    }
)

$cardY = 370
$fontCardTitle = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$fontCardDesc = New-Object System.Drawing.Font("Segoe UI", 12.5, [System.Drawing.FontStyle]::Regular)
$fontBadge = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)

foreach ($c in $cards) {
    # Card background
    $cBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 24, 33, 47))
    $cBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 51, 65, 85), 1.5)
    Draw-RoundedRectangle $g $cBg $cBorder 80 $cardY 920 135 14
    $cBg.Dispose(); $cBorder.Dispose()

    # Small badge inside card
    $bBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, $c.Color.R, $c.Color.G, $c.Color.B))
    $bPen = New-Object System.Drawing.Pen($c.Color, 1)
    Draw-RoundedRectangle $g $bBg $bPen 815 ($cardY + 16) 165 28 8
    $bBg.Dispose(); $bPen.Dispose()

    $bBrush = New-Object System.Drawing.SolidBrush($c.Color)
    $g.DrawString($c.Badge, $fontBadge, $bBrush, 825, ($cardY + 21))
    $bBrush.Dispose()

    # Card Title
    $tBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString($c.Title, $fontCardTitle, $tBrush, 105, ($cardY + 16))
    $tBrush.Dispose()

    # Card Description
    $dRect = New-Object System.Drawing.RectangleF(105, ($cardY + 54), 860, 65)
    $g.DrawString($c.Desc, $fontCardDesc, $brushGray, $dRect)

    $cardY += 160
}
$fontCardTitle.Dispose(); $fontCardDesc.Dispose(); $fontBadge.Dispose()

# 4. Bottom Banner: CTA Button & Link
$btnBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.PointF(80, 890)),
    (New-Object System.Drawing.PointF(450, 960)),
    [System.Drawing.Color]::FromArgb(255, 6, 182, 212),
    [System.Drawing.Color]::FromArgb(255, 37, 99, 235)
)
Draw-RoundedRectangle $g $btnBg $null 80 880 340 56 14
$btnBg.Dispose()

$fontBtn = New-Object System.Drawing.Font("Segoe UI Black", 16, [System.Drawing.FontStyle]::Bold)
$g.DrawString("nxtcanada.ca/lab-results", $fontBtn, $brushWhite, 102, 892)
$fontBtn.Dispose()

$fontBottomText = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$g.DrawString("🔍 Never buy peptides without a third-party COA", $fontBottomText, $brushGold, 450, 898)
$fontBottomText.Dispose(); $brushGold.Dispose()

# 5. Compliance footer
$fontComp = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 148, 163, 184))
$g.DrawString("Strictly for laboratory research use only. Not for human or animal consumption.", $fontComp, $brushMuted, 80, 975)
$fontComp.Dispose(); $brushMuted.Dispose()

# Save
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 96L)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

$bmp.Save($destPath, $jpegCodec, $encoderParams)
$g.Dispose()
$bmp.Dispose()
Write-Output "Successfully generated: $destPath"
