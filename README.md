# 🔥 Cigar Lounge — PWA Setup & Deployment Guide

## What You Have
A complete Progressive Web App (PWA) that works like a native app on your phone:
- **Offline support** — works without internet after first load
- **Add to Home Screen** — gets its own app icon, opens full-screen
- **Data persistence** — all your cigars, ratings, and favorites are saved locally
- **Camera access** — take photos of cigars directly in the app
- **Share to social** — share cigars to Twitter, Facebook, WhatsApp, etc.

---

## 🚀 Step-by-Step Deployment (15 minutes)

### Step 1: Create a GitHub Account
1. Go to [github.com](https://github.com) and sign up (free)
2. Verify your email

### Step 2: Install Git (if you don't have it)
- **Mac**: Open Terminal, type `git --version` (it will prompt you to install if needed)
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)

### Step 3: Create a New GitHub Repository
1. Click the **+** button (top right on GitHub) → **New repository**
2. Name it `cigar-lounge`
3. Keep it **Public** (required for free Vercel hosting)
4. Do NOT add a README (we already have files)
5. Click **Create repository**

### Step 4: Push Your Code to GitHub
Open your Terminal/Command Prompt, navigate to the project folder, and run:

```bash
cd cigar-lounge-pwa
git init
git add .
git commit -m "Initial commit - Cigar Lounge PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cigar-lounge.git
git push -u origin main
```
(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 5: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Choose **Continue with GitHub** and authorize Vercel
3. Click **Add New → Project**
4. Find and select your `cigar-lounge` repository
5. Vercel will auto-detect it's a Vite project
6. Click **Deploy** — wait about 60 seconds
7. You'll get a URL like `cigar-lounge.vercel.app` ✅

### Step 6: Install on Your Phone

**iPhone / iOS:**
1. Open the Vercel URL in **Safari** (must be Safari)
2. Tap the **Share** button (box with arrow at bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Cigar Lounge" and tap **Add**
5. The app icon appears on your home screen! 🎉

**Android:**
1. Open the Vercel URL in **Chrome**
2. You should see a banner saying "Add Cigar Lounge to Home screen"
3. If not, tap the **⋮ menu** → **"Add to Home screen"** or **"Install app"**
4. Tap **Install**
5. The app icon appears in your app drawer! 🎉

---

## 📱 Sharing With Friends

Once deployed, just share your Vercel URL with friends:
- `https://cigar-lounge.vercel.app` (or whatever your URL is)
- They can add it to their home screen the same way
- Each person's data is stored locally on their own device

> **Note**: The "Friends" feature currently uses demo data. For real friend
> connections where you can actually see each other's humidors, you'd need
> a backend database (Phase 2 — see below).

---

## 🔄 Making Updates

Whenever you want to update the app:
1. Make your changes to the code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel automatically redeploys — your app updates within ~60 seconds
4. Users' phones will pick up the new version next time they open the app

---

## 📋 Project Structure

```
cigar-lounge-pwa/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite + PWA configuration
├── public/
│   ├── favicon.svg         # Browser tab icon
│   ├── icon-192.png        # PWA icon (small)
│   ├── icon-512.png        # PWA icon (large)
│   └── apple-touch-icon.png # iOS home screen icon
└── src/
    ├── main.jsx            # React entry point
    ├── index.css           # Global styles
    └── CigarLounge.jsx     # Main app component
```

---

## 🛣️ Roadmap: Future Enhancements

### Phase 2: Real Backend (Firebase)
- User authentication (sign up / log in)
- Cloud database so data syncs across devices
- Real friend connections — actually see each other's humidors
- Push notifications when friends smoke a cigar

### Phase 3: Real Barcode Scanning
- Integrate `react-zxing` or `quagga.js` for real camera barcode reading
- Connect to a cigar database API (like CigarScanner or similar)
- Auto-populate cigar details from barcode

### Phase 4: Google Play Store
- Wrap the PWA with Capacitor
- Add native camera & notification support
- Submit to Google Play ($25 one-time fee)

---

## 🛠️ Local Development

If you want to run the app locally for testing:

```bash
cd cigar-lounge-pwa
npm install
npm run dev
```

This starts a local server (usually at `http://localhost:5173`).
Open it in your browser to test changes before pushing to GitHub.

---

## ❓ Troubleshooting

**"Add to Home Screen" option not showing?**
- On iOS, you MUST use Safari (not Chrome or other browsers)
- On Android, try Chrome or Edge
- Make sure you're on the live Vercel URL, not localhost

**App not updating?**
- Close the app completely and reopen it
- Or clear the browser cache for the site

**Photos not working?**
- Make sure you've granted camera/photo permissions when prompted
- On iOS, the browser will ask for photo library access

**Data disappeared?**
- Data is stored in your browser's localStorage
- Clearing browser data / cache will erase it
- This is why Phase 2 (cloud database) is important for production use
