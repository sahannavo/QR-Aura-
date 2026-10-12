<div align="center">

# ✨ QR Aura — Neumorphic QR Code Studio

**A sleek, modern web application designed with tactile Neumorphism (Soft UI) to convert URLs & text into high-resolution QR codes with instant PNG & JPG export.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla_Neumorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25_Client--Side-brightgreen?style=for-the-badge)](#-offline--privacy-first)

<br/>

<p align="center">
  <img src="assets/Light%20mode.png" alt="QR Aura Light Mode Preview" width="48%" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
  &nbsp;
  <img src="assets/dark%20mode.png" alt="QR Aura Dark Mode Preview" width="48%" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
</p>

*Experience tactile, soft-extruded interfaces in both Classic Light and Stealth Dark Neumorphic themes.*

</div>

---

## 🌟 Overview

**QR Aura** brings modern **Neumorphic (Soft UI)** design principles to utility tools. Transform any URL, Wi-Fi configuration, or custom text into 100% ISO-compliant QR codes with real-time live preview, granular styling options, and lossless exports.

---

## 🚀 Key Features

- **⚡ Real-Time Instant Generation**: QR code updates dynamically as you type with debounced zero-lag rendering.
- **🖼️ Dual Export Formats**:
  - **PNG**: Crisp, lossless export ideal for web, digital sharing, and transparent workflows.
  - **JPG**: Solid-filled, print-ready high-quality JPEG (0.95 quality) with no dark background compression artifacts.
- **🎨 Tactile Neumorphism (Soft UI)**:
  - Extruded dual-tone ambient shadows for raised surface elevation.
  - Carved inset (`inset`) input fields, dropdowns, and pressed button states.
  - Smooth light-to-dark theme transitions.
- **🌓 Dual Theme Support**: Effortlessly toggle between **Soft Cream Light** and **Deep Slate Dark** modes with persistent storage.
- **🌈 Custom Color Styling & Presets**: Custom foreground & background hex pickers alongside one-click presets (*Classic, Electric Blue, Royal Violet, Emerald Green, Sunset Orange, Inverted*).
- **📐 Granular Resolution & Quiet Zone**:
  - Export dimensions up to **2000 × 2000 px** (Print 300 DPI).
  - Customizable quiet zone margins (0–8 blocks).
  - Configurable Reed-Solomon Error Correction Level (`L`, `M`, `Q`, `H`).
- **📋 One-Click Copy & Native Share**: Copy image directly to your clipboard using the native Clipboard API, or trigger the Web Share API on mobile devices.
- **🕒 Local History Log**: Automatically saves recent codes locally with thumbnail previews for quick restoration.
- **🔒 100% Private & Offline**: Zero network requests or tracking. All encoding and rendering happens entirely on your machine.

---

## 📸 Interface Previews

| Light Mode (Classic Soft UI) | Dark Mode (Stealth Slate) |
| :---: | :---: |
| ![Light Mode](assets/Light%20mode.png) | ![Dark Mode](assets/dark%20mode.png) |
| *Soft clay extruded surfaces with debossed controls* | *Deep charcoal aesthetics with glowing focus accents* |

---

## 📂 Project Structure

```text
QR-Aura-/
├── assets/
│   ├── Light mode.png     # Application light mode screenshot
│   └── dark mode.png      # Application dark mode screenshot
├── index.html             # Semantic markup & interface layout
├── style.css              # Pure Vanilla CSS Neumorphic design system
├── app.js                 # UI interaction, theme toggle, and export logic
├── qrcode.bundle.js       # Offline, ISO-compliant QR code engine
└── README.md              # Project documentation
```

---

## 🛠️ Getting Started

### Option 1: Direct Browser Launch (No installation required)

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/QR-Aura-.git
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with a Local Server

You can preview the app using any static server:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js npx
npx serve .
```

Open `http://localhost:8080` in your browser.

---

## 💻 Tech Stack

- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Custom properties, Neumorphic dual box-shadows, Flexbox & CSS Grid)
- **Engine**: ISO/IEC 18004 Standard QR Code Engine (`qrcode.bundle.js`)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 🛡️ Offline & Privacy First

> **Note:** QR Aura runs **100% client-side**. Your URLs, Wi-Fi credentials, and generated QR codes are **never** transmitted to any external server or third-party service.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to fork, customize, and share!
