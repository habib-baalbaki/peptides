import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const socialDir = path.join(rootDir, 'social-media');
const outPath = path.join(socialDir, 'cover-designer.html');

function toBase64(filename) {
  const file = path.join(socialDir, filename);
  if (!fs.existsSync(file)) {
    console.warn(`File not found: ${file}`);
    return '';
  }
  const data = fs.readFileSync(file);
  return `data:image/jpeg;base64,${data.toString('base64')}`;
}

const images = {
  branded: toBase64('facebook-cover-1640x924.jpg'),
  branded1376: toBase64('facebook-cover-branded.jpg'),
  clean: toBase64('facebook-cover-v2.jpg'),
  lab: toBase64('facebook-cover-v3-raw.jpg')
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NXT Peptides Canada — Facebook Cover Studio & Safe Zone Simulator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-dark: #0a0e17;
    --card-bg: #111827;
    --card-border: #1f293d;
    --accent-cyan: #06b6d4;
    --accent-blue: #3b82f6;
    --accent-emerald: #10b981;
    --accent-gold: #f59e0b;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg-dark);
    color: var(--text-primary);
    font-family: var(--font-sans);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background: #0f172a;
    border-bottom: 1px solid var(--card-border);
    padding: 16px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .brand-tag {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 20px;
    color: #fff;
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
  }

  .brand-title {
    font-size: 18px;
    font-weight: 800;
  }

  .brand-sub {
    font-size: 12px;
    color: var(--accent-cyan);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .btn {
    background: #1e293b;
    border: 1px solid var(--card-border);
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-decoration: none;
    user-select: none;
  }
  .btn:hover {
    background: #334155;
    border-color: #475569;
  }
  .btn-primary {
    background: linear-gradient(135deg, #06b6d4, #2563eb);
    border: none;
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.35);
  }
  .btn-primary:hover {
    background: linear-gradient(135deg, #0891b2, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5);
  }
  .btn-success {
    background: #10b981 !important;
    color: #000 !important;
    border: none !important;
  }

  main {
    flex: 1;
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 24px;
    padding: 24px;
    max-width: 1720px;
    margin: 0 auto;
    width: 100%;
  }

  @media (max-width: 1100px) {
    main {
      grid-template-columns: 1fr;
    }
  }

  .panel {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .panel-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-label {
    font-size: 12px;
    font-weight: 700;
    color: #cbd5e1;
  }

  select, input {
    background: #0b1120;
    border: 1px solid #1e293b;
    border-radius: 8px;
    color: #fff;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 13px;
    outline: none;
  }

  .preview-stage {
    background: #0b1120;
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .view-tabs {
    display: flex;
    gap: 8px;
    background: #1e293b;
    padding: 4px;
    border-radius: 10px;
  }
  .view-tab {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    background: transparent;
    color: #94a3b8;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .view-tab.active {
    background: var(--accent-cyan);
    color: #000;
  }

  /* Mockup Viewport */
  .mockup-viewport {
    width: 100%;
    max-width: 1000px;
    aspect-ratio: 1640 / 924;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(6, 182, 212, 0.15);
    border: 2px solid #1e293b;
    background: #000;
    cursor: pointer;
  }

  .mockup-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.2s ease;
  }

  /* Desktop Crop Mask */
  .desktop-mask-top, .desktop-mask-bottom {
    position: absolute;
    left: 0; right: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    color: #f87171;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    z-index: 5;
    pointer-events: none;
  }
  .desktop-mask-top { top: 0; height: 16.2%; border-bottom: 2px dashed #ef4444; }
  .desktop-mask-bottom { bottom: 0; height: 16.2%; border-top: 2px dashed #ef4444; }

  .mode-desktop .desktop-mask-top,
  .mode-desktop .desktop-mask-bottom {
    display: flex;
  }

  /* Mobile Avatar Simulation */
  .mobile-profile-avatar {
    position: absolute;
    left: 40px;
    bottom: -30px;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4, #1e3a8a);
    border: 5px solid #0a0e17;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 38px;
    color: #fff;
    box-shadow: 0 10px 25px rgba(0,0,0,0.8);
    z-index: 10;
    pointer-events: none;
  }
  .mode-mobile .mobile-profile-avatar {
    display: flex;
  }

  .safe-guide-lines {
    position: absolute;
    inset: 16.2% 5%;
    border: 2px dashed rgba(6, 182, 212, 0.5);
    pointer-events: none;
    display: none;
    z-index: 8;
  }
  .safe-guide-lines::after {
    content: "FACEBOOK ALL-DEVICE SAFE ZONE (1640 x 624)";
    position: absolute;
    top: 8px; right: 12px;
    font-size: 10px;
    font-weight: 800;
    color: var(--accent-cyan);
    font-family: var(--font-mono);
  }
  .mode-guides .safe-guide-lines {
    display: block;
  }

  .specs-strip {
    width: 100%;
    max-width: 1000px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .spec-card {
    background: #0f172a;
    border: 1px solid var(--card-border);
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .spec-label { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; }
  .spec-value { font-size: 14px; color: #fff; font-weight: 800; }
  .spec-note { font-size: 11px; color: var(--accent-cyan); }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #10b981;
    color: #000;
    font-weight: 800;
    font-size: 14px;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  }
  .toast.show {
    transform: translateY(0);
    opacity: 1;
  }
</style>
</head>
<body>

<header>
  <div class="brand-tag">
    <div class="brand-logo">N</div>
    <div>
      <div class="brand-title">NXT Peptides Canada — Cover Studio</div>
      <div class="brand-sub">Facebook Desktop & Mobile Safe Zone Simulator</div>
    </div>
  </div>
  <div style="display: flex; gap: 12px;">
    <button id="btnHeaderDownload" class="btn btn-primary">
      ⬇ Download Active Cover (1640×924 HD)
    </button>
  </div>
</header>

<main>
  <!-- Controls Panel -->
  <div class="panel">
    <div class="panel-title">
      <span>Cover Variations</span>
      <span style="color: var(--accent-cyan); font-weight: 800;">1640 × 924</span>
    </div>

    <div class="form-group">
      <label class="form-label">Select Cover Design</label>
      <select id="selectDesign">
        <option value="branded" selected>Option 1: Official Branded Banner (Recommended)</option>
        <option value="clean">Option 2: Clean 3D Product Pedestal (No Text)</option>
        <option value="lab">Option 3: High-Tech Laboratory 3D Render</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Safe Zone Simulation Mode</label>
      <div class="view-tabs" style="width: 100%; justify-content: space-between;">
        <button class="view-tab active" id="tabFull">Full Banner</button>
        <button class="view-tab" id="tabDesktop">Desktop View</button>
        <button class="view-tab" id="tabMobile">Mobile View</button>
      </div>
    </div>

    <div class="panel-title" style="margin-top: 10px;">
      <span>Design & Safe Zone Details</span>
    </div>

    <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
      <p>✅ <strong>Typography:</strong> Segoe UI Black & Semibold with high-DPI ClearType smoothing.</p>
      <p style="margin-top: 6px;">✅ <strong>Testing Proof:</strong> Highlights Janoshik Analytical HPLC & Mass Spectrometry testing and batch lot matching.</p>
      <p style="margin-top: 6px;">✅ <strong>Logistics:</strong> Emphasizes Canadian domestic Xpresspost shipping & complimentary 3 mL bacteriostatic water.</p>
      <p style="margin-top: 6px;">✅ <strong>Safe Zone Guarantee:</strong> All text, buttons, and products are centered inside the 1640×624 px safe band so nothing gets cut off on desktop or mobile.</p>
    </div>

    <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
      <button id="btnPanelDownloadActive" class="btn btn-primary" style="width: 100%;">
        📥 Download Active Cover (1640×924)
      </button>
      <button id="btnPanelDownloadBranded1376" class="btn" style="width: 100%;">
        📥 Download Branded 1376×768 JPG
      </button>
      <div style="font-size: 11px; color: #64748b; text-align: center; margin-top: 4px;">
        💡 You can also right-click the preview image and select "Save image as..."
      </div>
    </div>
  </div>

  <!-- Preview Stage -->
  <div class="preview-stage">
    <div class="mockup-viewport" id="viewport" title="Right-click to save image directly">
      <!-- Masks for desktop simulation -->
      <div class="desktop-mask-top">DESKTOP CROP (Hidden on PC Monitors)</div>
      <div class="desktop-mask-bottom">DESKTOP CROP (Hidden on PC Monitors)</div>

      <!-- Safe guide lines -->
      <div class="safe-guide-lines"></div>

      <!-- Mobile Avatar Simulator -->
      <div class="mobile-profile-avatar">NXT</div>

      <!-- Active Cover Image -->
      <img src="${images.branded}" id="coverImg" class="mockup-img" alt="Facebook Cover Photo">
    </div>

    <!-- Specs Strip -->
    <div class="specs-strip">
      <div class="spec-card">
        <span class="spec-label">Upload Dimensions</span>
        <span class="spec-value">1640 × 924 px</span>
        <span class="spec-note">Facebook High-DPI Standard</span>
      </div>
      <div class="spec-card">
        <span class="spec-label">Desktop Aspect</span>
        <span class="spec-value">820 × 312 px (2.63:1)</span>
        <span class="spec-note">Crops 150px top/bottom</span>
      </div>
      <div class="spec-card">
        <span class="spec-label">Mobile Aspect</span>
        <span class="spec-value">640 × 360 px (16:9)</span>
        <span class="spec-note">Full height visible</span>
      </div>
    </div>
  </div>
</main>

<div id="toast" class="toast">
  <span>✓</span> <span id="toastMsg">Image downloaded to your computer!</span>
</div>

<script>
const IMAGES = {
  branded: "${images.branded}",
  branded1376: "${images.branded1376}",
  clean: "${images.clean}",
  lab: "${images.lab}"
};

const FILENAMES = {
  branded: "nxt-peptides-facebook-cover-1640x924.jpg",
  clean: "nxt-peptides-facebook-cover-clean-3d.jpg",
  lab: "nxt-peptides-facebook-cover-lab-render.jpg",
  branded1376: "nxt-peptides-facebook-cover-1376x768.jpg"
};

let currentKey = 'branded';
const coverImg = document.getElementById('coverImg');
const viewport = document.getElementById('viewport');
const selectDesign = document.getElementById('selectDesign');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Switch Designs
selectDesign.addEventListener('change', (e) => {
  currentKey = e.target.value;
  coverImg.src = IMAGES[currentKey];
});

// Robust Base64 to Blob Download function
function downloadBase64Image(dataUrl, filename) {
  if (!dataUrl) {
    alert("Image data not found.");
    return;
  }

  try {
    // 1. Convert base64 data to Blob
    const arr = dataUrl.split(',');
    const mime = (arr[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });

    // 2. Create blob URL
    const blobUrl = URL.createObjectURL(blob);

    // 3. Trigger programmatic download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename || 'facebook-cover.jpg';
    document.body.appendChild(a);
    a.click();

    // 4. Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1500);

    // 5. User feedback
    showToast('Downloaded: ' + filename);
  } catch (err) {
    console.error("Blob download failed, trying direct link fallback:", err);
    // Fallback: direct programmatic link
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || 'facebook-cover.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded: ' + filename);
  }
}

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Button Click Handlers
document.getElementById('btnHeaderDownload').addEventListener('click', (e) => {
  e.preventDefault();
  const filename = FILENAMES[currentKey] || 'facebook-cover-1640x924.jpg';
  downloadBase64Image(coverImg.src, filename);
});

document.getElementById('btnPanelDownloadActive').addEventListener('click', (e) => {
  e.preventDefault();
  const filename = FILENAMES[currentKey] || 'facebook-cover-1640x924.jpg';
  downloadBase64Image(coverImg.src, filename);
});

document.getElementById('btnPanelDownloadBranded1376').addEventListener('click', (e) => {
  e.preventDefault();
  downloadBase64Image(IMAGES.branded1376, FILENAMES.branded1376);
});

// Viewport Tab Handlers
const tabFull = document.getElementById('tabFull');
const tabDesktop = document.getElementById('tabDesktop');
const tabMobile = document.getElementById('tabMobile');

function resetTabs() {
  [tabFull, tabDesktop, tabMobile].forEach(t => t.classList.remove('active'));
  viewport.classList.remove('mode-desktop', 'mode-mobile', 'mode-guides');
}

tabFull.addEventListener('click', () => {
  resetTabs();
  tabFull.classList.add('active');
  viewport.classList.add('mode-guides');
});

tabDesktop.addEventListener('click', () => {
  resetTabs();
  tabDesktop.classList.add('active');
  viewport.classList.add('mode-desktop');
});

tabMobile.addEventListener('click', () => {
  resetTabs();
  tabMobile.classList.add('active');
  viewport.classList.add('mode-mobile');
});

// Default to safe guides view
viewport.classList.add('mode-guides');
</script>
</body>
</html>
`;

fs.writeFileSync(outPath, htmlContent, 'utf-8');
console.log('Successfully re-generated Cover Studio at:', outPath);
