import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const imgDir = path.join(rootDir, 'assets', 'img');
const outPath = path.join(rootDir, 'social-media', 'reel-generator.html');

function toBase64(filename) {
  const file = path.join(imgDir, filename);
  if (!fs.existsSync(file)) return '';
  const data = fs.readFileSync(file);
  return `data:image/jpeg;base64,${data.toString('base64')}`;
}

const images = {
  bpc157: toBase64('bpc157.jpg'),
  glow: toBase64('glow.jpg'),
  klow: toBase64('klow.jpg'),
  cjc1295: toBase64('cjc1295-ipamorelin.jpg'),
  bacwater: toBase64('bac-water.jpg')
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NXT Peptides Canada — Facebook Reel Studio & 1080p Video Generator</title>
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
    --accent-red: #ef4444;
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
    overflow-x: hidden;
  }

  header {
    background: #0f172a;
    border-bottom: 1px solid var(--card-border);
    padding: 16px 24px;
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
    letter-spacing: -0.02em;
  }

  .brand-sub {
    font-size: 12px;
    color: var(--accent-cyan);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .btn {
    background: #1e293b;
    border: 1px solid var(--card-border);
    color: #fff;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
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
  .btn-danger {
    background: #dc2626;
    border: none;
  }
  .btn-danger:hover { background: #b91c1c; }

  main {
    flex: 1;
    display: grid;
    grid-template-columns: 420px 1fr 340px;
    gap: 20px;
    padding: 24px;
    max-width: 1720px;
    margin: 0 auto;
    width: 100%;
  }

  @media (max-width: 1350px) {
    main {
      grid-template-columns: 380px 1fr;
    }
    .right-sidebar {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 900px) {
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
    gap: 16px;
  }

  .panel-title {
    font-size: 14px;
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

  select, input, textarea {
    background: #0b1120;
    border: 1px solid #1e293b;
    border-radius: 8px;
    color: #fff;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  select:focus, input:focus, textarea:focus {
    border-color: var(--accent-cyan);
  }

  /* Preview Stage */
  .preview-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #131d31 0%, #080c14 100%);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 24px;
    position: relative;
  }

  .phone-mockup {
    width: 360px;
    height: 640px;
    border-radius: 42px;
    background: #000;
    border: 10px solid #1f293d;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.15);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Safe Area / Reel Overlay Mock */
  .safe-area-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 14px 20px;
    z-index: 10;
    opacity: 0.85;
    transition: opacity 0.2s;
  }
  .safe-area-overlay.hidden { display: none; }

  .reel-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  }

  .reel-actions-column {
    position: absolute;
    right: 12px;
    bottom: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .reel-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  }
  .reel-action-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }

  .reel-bottom-caption {
    width: 78%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.9);
  }
  .reel-user-tag {
    font-size: 12px;
    font-weight: 800;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .reel-verified-badge {
    background: var(--accent-cyan);
    color: #000;
    font-size: 9px;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
  }
  .reel-caption-text {
    font-size: 11px;
    color: rgba(255,255,255,0.9);
    line-height: 1.3;
  }

  /* Canvas */
  #reelCanvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #0a0e17;
  }

  /* Transport & Timeline */
  .playback-controls {
    margin-top: 18px;
    width: 100%;
    max-width: 500px;
    background: #0f172a;
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .timeline-bar {
    width: 100%;
    height: 8px;
    background: #1e293b;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .timeline-progress {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #06b6d4, #3b82f6);
    border-radius: 4px;
    transition: width 0.05s linear;
  }

  .transport-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .time-display {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent-cyan);
    font-weight: 700;
  }

  /* Scenes List */
  .scene-card {
    background: #0b1120;
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .scene-card:hover {
    border-color: #3b82f6;
    background: #0d1629;
  }
  .scene-card.active {
    border-color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.08);
  }
  .scene-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .scene-number {
    font-size: 11px;
    font-weight: 800;
    color: var(--accent-cyan);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .scene-duration {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
  }
  .scene-title {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
  }
  .scene-desc {
    font-size: 11px;
    color: var(--text-secondary);
  }

  /* Recording Overlay Modal */
  .recording-banner {
    display: none;
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid #ef4444;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 700;
    color: #fca5a5;
    align-items: center;
    gap: 8px;
  }
  .recording-banner.active { display: flex; }
  .pulse-rec {
    width: 10px;
    height: 10px;
    background: #ef4444;
    border-radius: 50%;
    animation: blink 1s infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Script Copy Section */
  .copy-box {
    background: #090d16;
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.5;
    white-space: pre-wrap;
    max-height: 240px;
    overflow-y: auto;
  }

  .badge-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
  }
  .badge-cyan { background: rgba(6, 182, 212, 0.15); color: #38bdf8; }
  .badge-green { background: rgba(16, 185, 129, 0.15); color: #34d399; }
</style>
</head>
<body>

<header>
  <div class="brand-tag">
    <div class="brand-logo">N</div>
    <div>
      <div class="brand-title">NXT Peptides Canada — Reel Studio</div>
      <div class="brand-sub">Meta Reels & Shorts 1080p Engine</div>
    </div>
  </div>
  <div class="header-actions">
    <button class="btn" id="btnSnapPng">📸 Snap Frame (PNG)</button>
    <button class="btn btn-primary" id="btnExportVideo">
      <span>🎥</span> Record & Export 1080p Video (.webm)
    </button>
  </div>
</header>

<main>
  <!-- LEFT: Configuration & Scene Controls -->
  <div class="panel">
    <div class="panel-title">
      <span>Reel Customizer</span>
      <span class="badge-tag badge-cyan">9:16 Vertical</span>
    </div>

    <div class="recording-banner" id="recBanner">
      <div class="pulse-rec"></div>
      <span id="recText">Recording Reel in 1080x1920 HD... (0%)</span>
    </div>

    <div class="form-group">
      <label class="form-label">Featured Peptide Product</label>
      <select id="selectProduct">
        <option value="bpc157">BPC-157 (10 mg) — Pentadecapeptide</option>
        <option value="glow" selected>GLOW Blend (70 mg) — GHK-Cu + BPC-157 + TB-500</option>
        <option value="klow">KLOW Blend (80 mg) — 4-Compound Blend</option>
        <option value="cjc1295">CJC-1295 + Ipamorelin (10 mg)</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Hook Headline (First 4 Seconds)</label>
      <input type="text" id="inputHook" value="NOT ALL PEPTIDES ARE EQUAL.">
    </div>

    <div class="form-group">
      <label class="form-label">Sub-Hook / Pain Point</label>
      <input type="text" id="inputSubHook" value="Are you sure your research batch is verified?">
    </div>

    <div class="form-group">
      <label class="form-label">Testing Lab Callout</label>
      <input type="text" id="inputLab" value="Janoshik Analytical (Prague)">
    </div>

    <div class="form-group">
      <label class="form-label">Domestic Shipping Guarantee</label>
      <input type="text" id="inputShipping" value="Shipped in Canada via Xpresspost · Zero Customs Risk">
    </div>

    <div class="form-group">
      <label class="form-label">Promo / First Order Discount</label>
      <input type="text" id="inputPromo" value="20% Off First Orders · Code: WELCOME">
    </div>

    <div class="panel-title" style="margin-top: 10px;">
      <span>Scene Director (28.5s Total)</span>
    </div>

    <div id="scenesList" style="display: flex; flex-direction: column; gap: 8px;">
      <!-- Populated dynamically -->
    </div>
  </div>

  <!-- CENTER: Smartphone Mockup & Playback -->
  <div class="preview-stage">
    <div class="phone-mockup">
      <!-- Safe Zone Overlay (Facebook Reels UI) -->
      <div class="safe-area-overlay" id="safeZoneOverlay">
        <div class="reel-top-bar">
          <span>Reels</span>
          <span>🔍</span>
        </div>
        <div class="reel-actions-column">
          <div class="reel-action-btn">
            <div class="reel-action-icon">❤️</div>
            <span>3.4k</span>
          </div>
          <div class="reel-action-btn">
            <div class="reel-action-icon">💬</div>
            <span>128</span>
          </div>
          <div class="reel-action-btn">
            <div class="reel-action-icon">↗️</div>
            <span>Share</span>
          </div>
          <div class="reel-action-btn">
            <div class="reel-action-icon">🎵</div>
          </div>
        </div>
        <div class="reel-bottom-caption">
          <div class="reel-user-tag">
            <span>NXT Peptides Canada</span>
            <span class="reel-verified-badge">✓</span>
          </div>
          <div class="reel-caption-text">
            Independent HPLC & Mass Spec testing by Janoshik Analytical. Verified lot on every vial. 🇨🇦
          </div>
        </div>
      </div>

      <!-- Real HD Canvas 1080x1920 -->
      <canvas id="reelCanvas" width="1080" height="1920"></canvas>
    </div>

    <!-- Transport Bar -->
    <div class="playback-controls">
      <div class="timeline-bar" id="timelineBar">
        <div class="timeline-progress" id="timelineProgress"></div>
      </div>
      <div class="transport-buttons">
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn" id="btnPlayPause">▶ Play</button>
          <button class="btn" id="btnRestart">↺ Restart</button>
          <button class="btn" id="btnToggleOverlay" title="Toggle Facebook UI safe zone">👁️ UI Safe Zone</button>
        </div>
        <div class="time-display" id="timeDisplay">00:00 / 00:28</div>
      </div>
    </div>
  </div>

  <!-- RIGHT: Copy, Captions & Hashtags -->
  <div class="panel right-sidebar">
    <div class="panel-title">
      <span>Reel Strategy & Copy</span>
      <span class="badge-tag badge-green">Ready to Post</span>
    </div>

    <div class="form-group">
      <label class="form-label">Facebook Post Caption</label>
      <div class="copy-box" id="captionBox">Are you still trusting peptides without independent third-party lab verification? 🔬

In peptide research, purity and identity make or break your data. That's why every batch at NXT Peptides Canada is independently analyzed by Janoshik Analytical in Prague:
✅ HPLC purity confirmation (>99% verified)
✅ Mass Spectrometry (MS) identity verification
✅ Public COA task IDs matching the lot number on your vial

🇨🇦 Shipped directly across Canada with Canada Post Xpresspost. No customs delays. No border seizures. 
💧 Free 3 mL bacteriostatic water with every delivery.

👉 Explore verified research compounds and verify our live COAs at nxtcanada.ca (link in bio).

#PeptideResearch #JanoshikVerified #NXTCanada #Biochemistry #LabResearch #BPC157 #GLOW #CanadianScience #PeptideCommunity</div>
      <button class="btn" style="margin-top: 6px; width: 100%;" onclick="copyCaption()">📋 Copy Caption</button>
    </div>

    <div class="form-group">
      <label class="form-label">Audio & Voiceover Script</label>
      <div class="copy-box" style="font-size: 11px;">[0:00 - 0:04] "Not all research peptides are created equal. How do you know what's really inside your vial?"
[0:04 - 0:08] "Unverified claims and underdosed batches flood the market."
[0:08 - 0:15] "At NXT Peptides Canada, every batch is verified by Janoshik Analytical using HPLC and mass spectrometry."
[0:15 - 0:21] "The lot number printed on your vial matches the live certificate of analysis on Janoshik's portal."
[0:21 - 0:25] "Domestic Canadian shipping with Xpresspost. Zero border seizures. Plus free bacteriostatic water."
[0:25 - 0:28] "Elevate your research today at nxtcanada.ca."</div>
    </div>

    <div class="form-group">
      <label class="form-label">Audio Recommendation</label>
      <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">
        🎵 <strong>Facebook / IG Sound:</strong> Search for trending tech ambient or deep electronic sound: e.g. "Interstellar Minimal", "Synthwave Cyberpunk", or "Corporate Science Ambience".
      </div>
    </div>
  </div>
</main>

<script>
// --- ASSET REPOSITORY ---
const ASSETS = {
  products: {
    bpc157: {
      name: "BPC-157",
      subtitle: "Synthetic Pentadecapeptide · 10 mg",
      imgSrc: "${images.bpc157}",
      lot: "XN2601HYP",
      purity: "99.8% HPLC",
      task: "Janoshik #136713"
    },
    glow: {
      name: "GLOW Blend",
      subtitle: "GHK-Cu (50mg) + BPC-157 (10mg) + TB-500 (10mg)",
      imgSrc: "${images.glow}",
      lot: "XN2601HYP",
      purity: "Verified Ratio & Identity",
      task: "Janoshik #136712"
    },
    klow: {
      name: "KLOW Blend",
      subtitle: "GHK-Cu + KPV + BPC-157 + TB-500 · 80 mg",
      imgSrc: "${images.klow}",
      lot: "XN2601HYP",
      purity: "Verified Quad-Compound",
      task: "Janoshik #136715"
    },
    cjc1295: {
      name: "CJC-1295 + Ipamorelin",
      subtitle: "GHRH + Ghrelin Receptor Agonist · 10 mg",
      imgSrc: "${images.cjc1295}",
      lot: "XN2601HYP",
      purity: "99.8% HPLC Purity",
      task: "Janoshik #136714"
    }
  },
  bacWater: "${images.bacwater}"
};

// Preload Images
const loadedImages = {};
for (const [key, p] of Object.entries(ASSETS.products)) {
  const img = new Image();
  img.src = p.imgSrc;
  loadedImages[key] = img;
}
const bacWaterImg = new Image();
bacWaterImg.src = ASSETS.bacWater;

// --- SCENE DEFINITIONS ---
const SCENES = [
  { id: 1, name: "The Hook", start: 0, end: 4.5, title: "The Problem Hook", desc: "Attention grabbing question" },
  { id: 2, name: "The Market Risk", start: 4.5, end: 9.0, title: "Unverified Batches", desc: "Why blind buying fails" },
  { id: 3, name: "The Gold Standard", start: 9.0, end: 15.0, title: "Janoshik Testing", desc: "Independent HPLC & MS" },
  { id: 4, name: "The Proof", start: 15.0, end: 21.0, title: "Matching Lot Numbers", desc: "COA matches the vial" },
  { id: 5, name: "Domestic Advantage", start: 21.0, end: 25.0, title: "Canadian Shipping", desc: "Xpresspost + free BAC water" },
  { id: 6, name: "Call To Action", start: 25.0, end: 28.5, title: "Visit nxtcanada.ca", desc: "20% off code & link in bio" }
];

const TOTAL_DURATION = 28.5; // seconds

// --- STATE ---
let currentTime = 0;
let isPlaying = false;
let isRecording = false;
let lastFrameTimestamp = null;
let selectedProductKey = 'glow';

const canvas = document.getElementById('reelCanvas');
const ctx = canvas.getContext('2d');

// --- PARTICLES ENGINE ---
const particles = Array.from({ length: 45 }, () => ({
  x: Math.random() * 1080,
  y: Math.random() * 1920,
  vx: (Math.random() - 0.5) * 0.8,
  vy: -0.5 - Math.random() * 1.2,
  size: Math.random() * 3 + 1,
  alpha: Math.random() * 0.5 + 0.2
}));

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < 0) p.y = 1920;
    if (p.x < 0) p.x = 1080;
    if (p.x > 1080) p.x = 0;
  }
}

// --- RENDER ENGINE ---
function renderFrame(t) {
  const currentProd = ASSETS.products[selectedProductKey];
  const prodImg = loadedImages[selectedProductKey];

  // 1. Background gradient
  const bgGrad = ctx.createRadialGradient(540, 960, 200, 540, 960, 1100);
  bgGrad.addColorStop(0, '#101a2f');
  bgGrad.addColorStop(0.6, '#080d19');
  bgGrad.addColorStop(1, '#030509');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Background Hex Grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 120;
  for (let x = 0; x < 1080; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1920);
    ctx.stroke();
  }
  for (let y = 0; y < 1920; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1080, y);
    ctx.stroke();
  }

  // Draw floating particles
  for (const p of particles) {
    ctx.fillStyle = \`rgba(6, 182, 212, \${p.alpha})\`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Header Brand Tag (Constant across all scenes)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '800 32px "Plus Jakarta Sans"';
  ctx.letterSpacing = '4px';
  ctx.fillText('NXT PEPTIDES CANADA', 540, 140);

  ctx.fillStyle = '#06b6d4';
  ctx.font = '700 20px "JetBrains Mono"';
  ctx.letterSpacing = '2px';
  ctx.fillText('CANADIAN-BASED · THIRD-PARTY VERIFIED', 540, 180);

  // Top Progress Bar
  const progWidth = (t / TOTAL_DURATION) * 1000;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(40, 220, 1000, 8);
  const progGrad = ctx.createLinearGradient(40, 0, 1040, 0);
  progGrad.addColorStop(0, '#06b6d4');
  progGrad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = progGrad;
  ctx.fillRect(40, 220, progWidth, 8);
  ctx.restore();

  // SCENE ROUTING
  if (t < 4.5) {
    renderScene1(t);
  } else if (t < 9.0) {
    renderScene2(t - 4.5);
  } else if (t < 15.0) {
    renderScene3(t - 9.0, currentProd, prodImg);
  } else if (t < 21.0) {
    renderScene4(t - 15.0, currentProd, prodImg);
  } else if (t < 25.0) {
    renderScene5(t - 21.0);
  } else {
    renderScene6(t - 25.0);
  }
}

// SCENE 1: THE HOOK
function renderScene1(localT) {
  const hookText = document.getElementById('inputHook').value.toUpperCase();
  const subHook = document.getElementById('inputSubHook').value;

  // Warning Badge
  ctx.save();
  const badgePulse = 1 + Math.sin(localT * 6) * 0.05;
  ctx.translate(540, 480);
  ctx.scale(badgePulse, badgePulse);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
  roundRect(ctx, -240, -32, 480, 64, 32, true, false);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  roundRect(ctx, -240, -32, 480, 64, 32, false, true);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '800 22px "Plus Jakarta Sans"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚠️ ATTENTION CANADIAN RESEARCHERS', 0, 0);
  ctx.restore();

  // Kinetic Typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px "Plus Jakarta Sans"';

  // Animate lines
  const words = hookText.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
  ctx.shadowBlur = 30;
  ctx.fillText(line1, 540, 720);
  ctx.fillText(line2, 540, 810);
  ctx.shadowBlur = 0;

  // Question Callout
  ctx.font = '600 36px "Plus Jakarta Sans"';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(subHook, 540, 940);

  // Big Glowing Icon / Graphic
  const pulse = Math.sin(localT * 4) * 15;
  ctx.beginPath();
  ctx.arc(540, 1260, 160 + pulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
  ctx.fill();

  ctx.font = '120px "Plus Jakarta Sans"';
  ctx.fillText('🔬', 540, 1280);

  // Bottom prompt
  ctx.font = '700 26px "JetBrains Mono"';
  ctx.fillStyle = '#06b6d4';
  ctx.fillText('SWIPE TO SEE WHAT MATTERS ➔', 540, 1620);
  ctx.restore();
}

// SCENE 2: THE UNVERIFIED PROBLEM
function renderScene2(localT) {
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = '#ef4444';
  ctx.font = '800 24px "JetBrains Mono"';
  ctx.fillText('THE RESEARCH RISK', 540, 420);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 60px "Plus Jakarta Sans"';
  ctx.fillText('CAN YOU TRUST', 540, 500);
  ctx.fillStyle = '#f87171';
  ctx.fillText('UNVERIFIED VIALS?', 540, 580);

  // 3 Comparison Alert Cards
  const cards = [
    { title: "❌ Vague 'Made in Canada' Labels", sub: "No documented synthesis or domestic batch origin" },
    { title: "❌ Unverified PDF Reports", sub: "COAs with no lab verification link or missing tasks" },
    { title: "❌ International Border Seizures", sub: "Packages delayed or confiscated at customs" }
  ];

  cards.forEach((card, idx) => {
    const cardY = 740 + idx * 240;
    const animOffset = Math.max(0, 1 - (localT - idx * 0.4) * 2);
    const alpha = Math.min(1, Math.max(0, (localT - idx * 0.4) * 2));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, animOffset * 40);

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    roundRect(ctx, 120, cardY, 840, 190, 20, true, false);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    roundRect(ctx, 120, cardY, 840, 190, 20, false, true);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f87171';
    ctx.font = '800 32px "Plus Jakarta Sans"';
    ctx.fillText(card.title, 160, cardY + 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px "Plus Jakarta Sans"';
    ctx.fillText(card.sub, 160, cardY + 125);
    ctx.restore();
  });

  ctx.restore();
}

// SCENE 3: THE GOLD STANDARD (JANOSHIK ANALYTICAL)
function renderScene3(localT, prod, img) {
  const lab = document.getElementById('inputLab').value;

  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = '#06b6d4';
  ctx.font = '800 24px "JetBrains Mono"';
  ctx.fillText('THE NXT STANDARD', 540, 400);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 62px "Plus Jakarta Sans"';
  ctx.fillText('100% INDEPENDENT', 540, 480);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('LABORATORY TESTING', 540, 560);

  // Lab Badge Box
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  roundRect(ctx, 140, 660, 800, 180, 24, true, false);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  roundRect(ctx, 140, 660, 800, 180, 24, false, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 34px "Plus Jakarta Sans"';
  ctx.fillText(lab, 540, 735);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 22px "JetBrains Mono"';
  ctx.fillText('HPLC Purity · Mass Spectrometry (MS) Identity', 540, 790);

  // 2 Proof Pillars
  const pillars = [
    { num: "99.8%+", label: "HPLC Purity Tested" },
    { num: "MATCHED", label: "Lot # to Online COA" }
  ];

  pillars.forEach((p, idx) => {
    const px = 180 + idx * 380;
    ctx.fillStyle = '#111827';
    roundRect(ctx, px, 900, 340, 260, 20, true, false);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    roundRect(ctx, px, 900, 340, 260, 20, false, true);

    ctx.fillStyle = '#34d399';
    ctx.font = '900 48px "Plus Jakarta Sans"';
    ctx.fillText(p.num, px + 170, 1000);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '700 20px "Plus Jakarta Sans"';
    ctx.fillText(p.label, px + 170, 1070);
  });

  // Simulated Chromatography Graph Line
  ctx.beginPath();
  ctx.moveTo(140, 1500);
  for (let x = 140; x <= 940; x += 5) {
    const center = 540;
    const dist = Math.abs(x - center);
    // Gaussian peak
    const peak = Math.exp(-Math.pow(dist / 40, 2)) * 240;
    const noise = Math.sin(x * 0.1 + localT * 5) * 5;
    ctx.lineTo(x, 1500 - peak + noise);
  }
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '700 22px "JetBrains Mono"';
  ctx.fillText('SINGLE ULTRA-SHARP HPLC PEAK (ZERO CONTAMINANTS)', 540, 1580);

  ctx.restore();
}

// SCENE 4: REAL BATCH PROOF & VIAL SHOWCASE
function renderScene4(localT, prod, img) {
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 24px "JetBrains Mono"';
  ctx.fillText('VERIFIABLE ON VERIFY.JANOSHIK.COM', 540, 380);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px "Plus Jakarta Sans"';
  ctx.fillText(prod.name.toUpperCase(), 540, 460);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 26px "Plus Jakarta Sans"';
  ctx.fillText(prod.subtitle, 540, 520);

  // Vial Image with 3D Float Animation
  const floatOffset = Math.sin(localT * 3) * 15;
  const vialY = 620 + floatOffset;

  // Vial glow circle
  ctx.beginPath();
  ctx.arc(540, vialY + 260, 240, 0, Math.PI * 2);
  const glowGrad = ctx.createRadialGradient(540, vialY + 260, 50, 540, vialY + 260, 240);
  glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
  glowGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fill();

  // Draw Vial
  if (img && img.complete) {
    ctx.save();
    roundRect(ctx, 330, vialY, 420, 520, 28, true, false);
    ctx.clip();
    ctx.drawImage(img, 330, vialY, 420, 520);
    ctx.restore();

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 3;
    roundRect(ctx, 330, vialY, 420, 520, 28, false, true);
  }

  // Floating Lot Number & COA Spec Card
  const cardY = 1240;
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, 140, cardY, 800, 300, 24, true, false);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  roundRect(ctx, 140, cardY, 800, 300, 24, false, true);

  // Card Content
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 22px "JetBrains Mono"';
  ctx.fillText('BATCH LOT NUMBER:', 190, cardY + 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 28px "JetBrains Mono"';
  ctx.fillText(prod.lot, 540, cardY + 70);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 22px "JetBrains Mono"';
  ctx.fillText('JANOSHIK TASK ID:', 190, cardY + 140);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 28px "JetBrains Mono"';
  ctx.fillText(prod.task, 540, cardY + 140);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 22px "JetBrains Mono"';
  ctx.fillText('VERIFIED RESULT:', 190, cardY + 210);
  ctx.fillStyle = '#34d399';
  ctx.font = '800 28px "JetBrains Mono"';
  ctx.fillText(prod.purity, 540, cardY + 210);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#06b6d4';
  ctx.font = '700 22px "Plus Jakarta Sans"';
  ctx.fillText('The exact lot printed on the vial matches the public report', 540, cardY + 270);

  ctx.restore();
}

// SCENE 5: DOMESTIC CANADIAN ADVANTAGE
function renderScene5(localT) {
  const shipping = document.getElementById('inputShipping').value;

  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = '#ef4444';
  ctx.font = '800 32px "Plus Jakarta Sans"';
  ctx.fillText('🇨🇦 CANADIAN-BASED', 540, 400);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 62px "Plus Jakarta Sans"';
  ctx.fillText('FAST DOMESTIC', 540, 480);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('SHIPPING (XPRESSPOST)', 540, 560);

  // Free BAC Water Box
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, 140, 680, 800, 360, 24, true, false);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  roundRect(ctx, 140, 680, 800, 360, 24, false, true);

  if (bacWaterImg.complete) {
    ctx.save();
    roundRect(ctx, 180, 720, 260, 280, 16, true, false);
    ctx.clip();
    ctx.drawImage(bacWaterImg, 180, 720, 260, 280);
    ctx.restore();
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 32px "Plus Jakarta Sans"';
  ctx.fillText('FREE 3 mL BAC WATER', 480, 790);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 24px "Plus Jakarta Sans"';
  ctx.fillText('Included complimentary', 480, 840);
  ctx.fillText('with every single delivery', 480, 875);

  ctx.fillStyle = '#34d399';
  ctx.font = '700 20px "JetBrains Mono"';
  ctx.fillText('No extra purchase needed', 480, 930);

  // 3 Feature Badges
  const features = [
    "📦 Shipped within Canada",
    "🛡️ No Customs Interception",
    "⚡ Same-Day Dispatch (by 2 PM ET)"
  ];

  features.forEach((feat, i) => {
    const fy = 1140 + i * 130;
    ctx.fillStyle = '#111827';
    roundRect(ctx, 140, fy, 800, 100, 16, true, false);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    roundRect(ctx, 140, fy, 800, 100, 16, false, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 28px "Plus Jakarta Sans"';
    ctx.textAlign = 'center';
    ctx.fillText(feat, 540, fy + 60);
  });

  ctx.restore();
}

// SCENE 6: CALL TO ACTION
function renderScene6(localT) {
  const promo = document.getElementById('inputPromo').value;

  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = '#06b6d4';
  ctx.font = '800 26px "JetBrains Mono"';
  ctx.fillText('ELEVATE YOUR RESEARCH', 540, 420);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px "Plus Jakarta Sans"';
  ctx.fillText('ORDER WITH', 540, 520);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('FULL CONFIDENCE', 540, 610);

  // Promo code badge
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  roundRect(ctx, 160, 740, 760, 130, 24, true, false);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  roundRect(ctx, 160, 740, 760, 130, 24, false, true);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 32px "Plus Jakarta Sans"';
  ctx.fillText(promo, 540, 818);

  // Big CTA Button
  const btnPulse = 1 + Math.sin(localT * 5) * 0.03;
  ctx.save();
  ctx.translate(540, 1060);
  ctx.scale(btnPulse, btnPulse);
  const btnGrad = ctx.createLinearGradient(-320, 0, 320, 0);
  btnGrad.addColorStop(0, '#06b6d4');
  btnGrad.addColorStop(1, '#2563eb');
  ctx.fillStyle = btnGrad;
  roundRect(ctx, -320, -55, 640, 110, 55, true, false);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Plus Jakarta Sans"';
  ctx.textBaseline = 'middle';
  ctx.fillText('VISIT NXTCANADA.CA', 0, 0);
  ctx.restore();

  // Secondary subtext
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 28px "Plus Jakarta Sans"';
  ctx.fillText('TAP LINK IN BIO TO VIEW LAB RESULTS', 540, 1260);

  // Compliance statement (Required for compliance)
  ctx.fillStyle = '#475569';
  ctx.font = '500 20px "JetBrains Mono"';
  ctx.fillText('Strictly for laboratory research use only.', 540, 1580);
  ctx.fillText('Not for human or veterinary consumption.', 540, 1620);
  ctx.restore();
}

// Utility: Rounded Rectangle
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// --- ANIMATION LOOP ---
function tick(timestamp) {
  if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
  const delta = (timestamp - lastFrameTimestamp) / 1000;
  lastFrameTimestamp = timestamp;

  if (isPlaying) {
    currentTime += delta;
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0; // loop
    }
    updateUI();
  }

  updateParticles();
  renderFrame(currentTime);

  requestAnimationFrame(tick);
}

// UI Synchronization
function updateUI() {
  const pct = (currentTime / TOTAL_DURATION) * 100;
  document.getElementById('timelineProgress').style.width = pct + '%';

  const m = Math.floor(currentTime / 60);
  const s = Math.floor(currentTime % 60);
  const totalM = Math.floor(TOTAL_DURATION / 60);
  const totalS = Math.floor(TOTAL_DURATION % 60);

  document.getElementById('timeDisplay').textContent =
    String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' / ' +
    String(totalM).padStart(2, '0') + ':' + String(totalS).padStart(2, '0');

  // Highlight active scene
  SCENES.forEach(scene => {
    const el = document.getElementById('sceneCard_' + scene.id);
    if (el) {
      if (currentTime >= scene.start && currentTime < scene.end) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
}

// --- EVENT HANDLERS ---
document.getElementById('btnPlayPause').addEventListener('click', () => {
  isPlaying = !isPlaying;
  document.getElementById('btnPlayPause').textContent = isPlaying ? '⏸ Pause' : '▶ Play';
});

document.getElementById('btnRestart').addEventListener('click', () => {
  currentTime = 0;
  isPlaying = true;
  document.getElementById('btnPlayPause').textContent = '⏸ Pause';
  updateUI();
});

document.getElementById('btnToggleOverlay').addEventListener('click', () => {
  document.getElementById('safeZoneOverlay').classList.toggle('hidden');
});

document.getElementById('selectProduct').addEventListener('change', (e) => {
  selectedProductKey = e.target.value;
});

document.getElementById('timelineBar').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  currentTime = ratio * TOTAL_DURATION;
  updateUI();
});

// Build Scene Cards
const scenesListEl = document.getElementById('scenesList');
SCENES.forEach(s => {
  const card = document.createElement('div');
  card.className = 'scene-card';
  card.id = 'sceneCard_' + s.id;
  card.innerHTML = \`
    <div class="scene-header">
      <span class="scene-number">Scene \${s.id}: \${s.name}</span>
      <span class="scene-duration">\${s.start.toFixed(1)}s - \${s.end.toFixed(1)}s</span>
    </div>
    <div class="scene-title">\${s.title}</div>
    <div class="scene-desc">\${s.desc}</div>
  \`;
  card.addEventListener('click', () => {
    currentTime = s.start;
    isPlaying = false;
    document.getElementById('btnPlayPause').textContent = '▶ Play';
    updateUI();
  });
  scenesListEl.appendChild(card);
});

// Snapshot Frame
document.getElementById('btnSnapPng').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = \`nxt-reel-frame-\${Math.floor(currentTime)}s.png\`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Copy Caption
function copyCaption() {
  const text = document.getElementById('captionBox').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Caption copied to clipboard!');
  });
}

// --- VIDEO EXPORT RECORDER (MediaRecorder API) ---
document.getElementById('btnExportVideo').addEventListener('click', async () => {
  if (isRecording) return;
  isRecording = true;
  isPlaying = false;
  currentTime = 0;

  const recBanner = document.getElementById('recBanner');
  const recText = document.getElementById('recText');
  const exportBtn = document.getElementById('btnExportVideo');
  recBanner.classList.add('active');
  exportBtn.disabled = true;

  // Determine supported mime type
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
  }

  const stream = canvas.captureStream(30); // 30 FPS
  const recorder = new MediaRecorder(stream, {
    mimeType: mimeType,
    videoBitsPerSecond: 8000000 // 8 Mbps high quality
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`nxt-peptides-janoshik-reel-\${Date.now()}.webm\`;
    a.click();
    URL.revokeObjectURL(url);

    recBanner.classList.remove('active');
    exportBtn.disabled = false;
    isRecording = false;
    currentTime = 0;
    updateUI();
  };

  recorder.start();

  // Step through time precisely at 30 fps
  const fps = 30;
  const dt = 1 / fps;
  const totalFrames = Math.ceil(TOTAL_DURATION * fps);
  let frame = 0;

  function recordStep() {
    if (frame < totalFrames) {
      currentTime = frame * dt;
      renderFrame(currentTime);
      updateParticles();
      updateUI();

      const pct = Math.floor((frame / totalFrames) * 100);
      recText.textContent = \`Recording Reel in 1080x1920 HD... (\${pct}%)\`;

      frame++;
      setTimeout(recordStep, 1000 / fps);
    } else {
      recorder.stop();
    }
  }

  recordStep();
});

// Start loop
requestAnimationFrame(tick);
</script>
</body>
</html>
`;

fs.writeFileSync(outPath, htmlContent, 'utf-8');
console.log('Successfully generated Reel Studio at:', outPath);

