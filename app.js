/**
 * QR Aura — Core Application Logic
 * Powered by local standalone zero-dependency engine (qrcodegen.js)
 * Supports live rendering, full customization, and high-res PNG / JPG downloads
 */

(function () {
  'use strict';

  // DOM Elements
  const urlInput = document.getElementById('urlInput');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const fgColorInput = document.getElementById('fgColor');
  const bgColorInput = document.getElementById('bgColor');
  const fgColorVal = document.getElementById('fgColorVal');
  const bgColorVal = document.getElementById('bgColorVal');
  const sizeSelect = document.getElementById('sizeSelect');
  const marginRange = document.getElementById('marginRange');
  const marginVal = document.getElementById('marginVal');
  const eccSelect = document.getElementById('eccSelect');
  const qrForm = document.getElementById('qrForm');
  const qrCanvas = document.getElementById('qrCanvas');
  const targetUrlDisplay = document.getElementById('targetUrlDisplay');
  const renderStatusBadge = document.getElementById('renderStatusBadge');
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  const downloadJpgBtn = document.getElementById('downloadJpgBtn');
  const copyImageBtn = document.getElementById('copyImageBtn');
  const shareBtn = document.getElementById('shareBtn');
  const resetBtn = document.getElementById('resetBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const historyGrid = document.getElementById('historyGrid');
  const emptyHistoryMsg = document.getElementById('emptyHistoryMsg');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Application State
  const STORAGE_KEY_HISTORY = 'qr_aura_history_v2';
  const STORAGE_KEY_THEME = 'qr_aura_theme';
  let debounceTimer = null;
  let qrHistory = [];

  // Initialize
  initTheme();
  loadHistory();
  setupEventListeners();

  // Initial QR render
  generateQRCode(false);

  /* -------------------------------------------------------------
     Core QR Rendering Engine (Official Standard)
  ------------------------------------------------------------- */

  function getOptions() {
    let rawText = urlInput.value.trim();
    if (!rawText) {
      rawText = 'https://google.com';
    }

    return {
      text: rawText,
      width: parseInt(sizeSelect.value, 10) || 600,
      margin: parseInt(marginRange.value, 10) || 3,
      colorDark: fgColorInput.value || '#0f172a',
      colorLight: bgColorInput.value || '#ffffff',
      errorCorrectionLevel: eccSelect.value || 'M'
    };
  }

  function generateQRCode(saveToHistory = false) {
    const opts = getOptions();
    targetUrlDisplay.textContent = opts.text;

    if (typeof QRCode === 'undefined' || !QRCode.toCanvas) {
      renderStatusBadge.textContent = 'Engine Loading';
      return;
    }

    QRCode.toCanvas(
      qrCanvas,
      opts.text,
      {
        width: opts.width,
        margin: opts.margin,
        color: {
          dark: opts.colorDark,
          light: opts.colorLight
        },
        errorCorrectionLevel: opts.errorCorrectionLevel
      },
      function (err) {
        if (err) {
          console.error('QR Render Error:', err);
          renderStatusBadge.textContent = 'Error';
          renderStatusBadge.style.color = '#ef4444';
          showToast(err.message || 'Error generating QR code');
          return;
        }

        renderStatusBadge.textContent = 'Ready';
        renderStatusBadge.style.color = '#10b981';
        renderStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.25)';

        if (saveToHistory) {
          addToHistory(opts.text);
        }
      }
    );
  }

  function queueAutoGenerate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      generateQRCode(false);
    }, 120);
  }

  /* -------------------------------------------------------------
     Export: PNG and JPG
  ------------------------------------------------------------- */
  function getExportFilename(extension) {
    let base = urlInput.value.trim().replace(/^https?:\/\//i, '').replace(/[^a-zA-Z0-9]/g, '_');
    if (!base || base.length === 0) base = 'qrcode';
    if (base.length > 20) base = base.substring(0, 20);
    const dateStamp = new Date().toISOString().slice(0, 10);
    return `${base}_${dateStamp}.${extension}`;
  }

  function triggerDownload(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Export as PNG
  function exportAsPng() {
    try {
      const dataUrl = qrCanvas.toDataURL('image/png');
      const filename = getExportFilename('png');
      triggerDownload(dataUrl, filename);
      showToast(`Saved as ${filename}`);
      addToHistory(urlInput.value.trim());
    } catch (err) {
      console.error(err);
      showToast('Error exporting PNG');
    }
  }

  // Export as JPG (Guarantees crisp opaque background)
  function exportAsJpg() {
    try {
      const width = qrCanvas.width;
      const height = qrCanvas.height;

      // Draw onto offscreen canvas with explicit background fill
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext('2d');

      // Solid background fill (prevent black artifacts in JPG)
      ctx.fillStyle = bgColorInput.value || '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw current QR canvas over it
      ctx.drawImage(qrCanvas, 0, 0);

      // Export JPG at 95% quality
      const dataUrl = offscreen.toDataURL('image/jpeg', 0.95);
      const filename = getExportFilename('jpg');
      triggerDownload(dataUrl, filename);
      showToast(`Saved as ${filename}`);
      addToHistory(urlInput.value.trim());
    } catch (err) {
      console.error(err);
      showToast('Error exporting JPG');
    }
  }

  // Copy Image to Clipboard
  async function copyImageToClipboard() {
    if (!navigator.clipboard || !window.ClipboardItem) {
      showToast('Clipboard API is not supported in this browser');
      return;
    }

    try {
      qrCanvas.toBlob(async function (blob) {
        if (!blob) {
          showToast('Could not convert canvas to image');
          return;
        }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('QR Code copied to clipboard!');
      }, 'image/png');
    } catch (err) {
      console.error(err);
      showToast('Could not copy image');
    }
  }

  // Share
  async function shareQRCode() {
    const textToShare = urlInput.value.trim() || 'https://google.com';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: 'Scan this QR Code for: ' + textToShare,
          url: textToShare.startsWith('http') ? textToShare : undefined
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(textToShare);
      showToast('Link copied to clipboard!');
    } else {
      showToast('Sharing not supported on this device');
    }
  }

  /* -------------------------------------------------------------
     History Management
  ------------------------------------------------------------- */
  function loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        qrHistory = JSON.parse(stored);
      }
    } catch (e) {
      qrHistory = [];
    }
    renderHistory();
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(qrHistory));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
    renderHistory();
  }

  function addToHistory(text) {
    if (!text || text.trim() === '') return;
    text = text.trim();

    // Deduplicate
    qrHistory = qrHistory.filter(item => item.text !== text);

    let thumb = '';
    try {
      thumb = qrCanvas.toDataURL('image/png');
    } catch (e) {}

    qrHistory.unshift({
      text: text,
      thumb: thumb,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (qrHistory.length > 8) {
      qrHistory.pop();
    }

    saveHistory();
  }

  function renderHistory() {
    historyGrid.innerHTML = '';

    if (!qrHistory || qrHistory.length === 0) {
      historyGrid.appendChild(emptyHistoryMsg);
      emptyHistoryMsg.classList.remove('hidden');
      return;
    }

    emptyHistoryMsg.classList.add('hidden');

    qrHistory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.title = `Click to reload: ${item.text}`;

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'history-thumb-wrap';

      const img = document.createElement('img');
      img.className = 'history-thumb';
      img.src = item.thumb || '';
      img.alt = 'QR Code';
      thumbWrap.appendChild(img);

      const textLabel = document.createElement('span');
      textLabel.className = 'history-text';
      textLabel.textContent = item.text;

      card.appendChild(thumbWrap);
      card.appendChild(textLabel);

      card.addEventListener('click', () => {
        urlInput.value = item.text;
        generateQRCode(false);
        showToast('Restored QR Code');
      });

      historyGrid.appendChild(card);
    });
  }

  function clearHistory() {
    qrHistory = [];
    saveHistory();
    showToast('History cleared');
  }

  /* -------------------------------------------------------------
     Theme Support
  ------------------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'dark') {
      document.body.classList.remove('light-theme');
      themeIconSun.classList.remove('hidden');
      themeIconMoon.classList.add('hidden');
    } else {
      document.body.classList.add('light-theme');
      themeIconSun.classList.add('hidden');
      themeIconMoon.classList.remove('hidden');
    }
  }

  function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    if (isLight) {
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
      themeIconSun.classList.add('hidden');
      themeIconMoon.classList.remove('hidden');
    } else {
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
      themeIconSun.classList.remove('hidden');
      themeIconMoon.classList.add('hidden');
    }
  }

  /* -------------------------------------------------------------
     Toast Feedback
  ------------------------------------------------------------- */
  let toastTimeout = null;
  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  /* -------------------------------------------------------------
     Event Listeners
  ------------------------------------------------------------- */
  function setupEventListeners() {
    // Live update on input
    urlInput.addEventListener('input', queueAutoGenerate);

    // Clear input
    clearInputBtn.addEventListener('click', () => {
      urlInput.value = '';
      urlInput.focus();
      queueAutoGenerate();
    });

    // Form submission
    qrForm.addEventListener('submit', (e) => {
      e.preventDefault();
      generateQRCode(true);
      showToast('QR Code generated!');
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
      urlInput.value = 'https://google.com';
      fgColorInput.value = '#0f172a';
      fgColorVal.textContent = '#0F172A';
      bgColorInput.value = '#ffffff';
      bgColorVal.textContent = '#FFFFFF';
      sizeSelect.value = '600';
      marginRange.value = '3';
      marginVal.textContent = '3 blocks';
      eccSelect.value = 'M';
      generateQRCode(false);
      showToast('Reset settings');
    });

    // Color Inputs
    fgColorInput.addEventListener('input', (e) => {
      fgColorVal.textContent = e.target.value.toUpperCase();
      queueAutoGenerate();
    });

    bgColorInput.addEventListener('input', (e) => {
      bgColorVal.textContent = e.target.value.toUpperCase();
      queueAutoGenerate();
    });

    // Color Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fg = btn.dataset.fg;
        const bg = btn.dataset.bg;
        fgColorInput.value = fg;
        fgColorVal.textContent = fg.toUpperCase();
        bgColorInput.value = bg;
        bgColorVal.textContent = bg.toUpperCase();
        generateQRCode(false);
      });
    });

    // Sample Chips
    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        urlInput.value = chip.dataset.val;
        generateQRCode(true);
      });
    });

    // Advanced options
    sizeSelect.addEventListener('change', queueAutoGenerate);
    eccSelect.addEventListener('change', queueAutoGenerate);
    marginRange.addEventListener('input', (e) => {
      marginVal.textContent = `${e.target.value} blocks`;
      queueAutoGenerate();
    });

    // Export Buttons
    downloadPngBtn.addEventListener('click', exportAsPng);
    downloadJpgBtn.addEventListener('click', exportAsJpg);
    copyImageBtn.addEventListener('click', copyImageToClipboard);
    shareBtn.addEventListener('click', shareQRCode);

    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // History clear
    clearHistoryBtn.addEventListener('click', clearHistory);
  }
})();
