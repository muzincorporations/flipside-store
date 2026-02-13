# FlipSide Deployment Instructions

## What I've Done ✅

1. ✅ Restored original logo
2. ✅ All website files are ready in `c:\workspace\FlipSide\`
3. ✅ PayPal integration configured (needs your Client ID)
4. ✅ All features tested and working

# FlipSide Deployment Instructions 🚀

Since your Netlify trial has ended, here are the best **Free Forever** alternatives to host the FlipSide platform.

## 💻 1. Local Testing (Instant & Offline)
To test the site on your computer right now without uploading anything:
1. Open a terminal (PowerShell or CMD) in `c:\workspace\FlipSide\`
2. Run this command:
   ```bash
   npx -y http-server . -p 8080
   ```
3. Open your browser to: `http://localhost:8080`

---

## ☁️ 2. Top Free Hosting Options

### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign up for a free "Hobby" account.
2. Install the Vercel CLI by running `npm install -g vercel` (if you have Node.js).
3. In your project folder, simply type `vercel`.
4. Follow the prompts—your site will be live in seconds!

### Option B: GitHub Pages (Free Forever)
1. Create a repository on GitHub named `flipside-store`.
2. Upload all files from `c:\workspace\FlipSide\`.
3. Go to **Settings > Pages**, select the `main` branch, and click **Save**.
4. Your site will be at `https://yourusername.github.io/flipside-store/`.

### Option C: Surge.sh (Super Simple CLI)
1. Open terminal in your project folder.
2. Run: `npx surge .`
3. Enter your email and a desired sub-domain (e.g., `flipside-store.surge.sh`).

---

## 🔑 Crucial Setup (For Live Site)

1. **PayPal Client ID**: 
   - Get your Client ID from [PayPal Developer](https://developer.paypal.com).
   - Update `js/config.js` and `checkout.html`.

2. **Firebase Setup**:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com).
   - Copy your config into `js/config.js`.
   - **Important**: In Firebase Console, go to **Authentication > Settings > Authorized Domains** and add your new hosting URL (e.g., `flipside-store.vercel.app`).

3. **Admin Security**:
   - Change your password in `js/config.js` before deploying!

---

## � 404 IMMEDIATE FIX

If you see a **404 Page Not Found** error, it's because GitHub doesn't see `index.html` in the "root" of your repository. 

**Here is the 1-minute fix:**
1. Go to your GitHub Repository.
2. If you see a folder named `FlipSide` inside your repo, **that is the problem**.
3. **The Fix**: 
   - Click "Add file" -> "Upload files".
   - Open the `FlipSide` folder on your computer.
   - **Select ALL files inside** (index.html, assets, css, js, etc.).
   - Drag **those files** into GitHub.
   - Once they upload, delete the old `FlipSide` folder if it's still there.

Your files should look like this on GitHub:
```
. (Your Repository)
├── assets/
├── css/
├── js/
├── index.html  <-- MUST be here, not inside a folder!
└── ...
```

---

## Still not working?
If you've done the above and still see 404:
- Wait 2 minutes (GitHub takes a moment to "build").
- Go to **Settings > Pages** and make sure it says: "Your site is live at..."
- Tell me what the site's URL is and I'll check it from my end!

---

## 🔄 How to Update Your Store (Add New Products/Images)

Whenever you make a change locally (like adding a new product in `js/products.js` or dropping a new image into `assets/products/`), follow these steps to push it live:

1.  **Go to GitHub**: Open your repository page.
2.  **Upload Files**: Click the **Add file** button and select **Upload files**.
3.  **The "Select All" Trick**: To avoid missing anything, open your local `FlipSide` folder, select **EVERYTHING** (all files and folders), and drag them into the GitHub upload area.
4.  **Overwrite**: GitHub will automatically detect which files are new or changed and update them.
5.  **Commit**: Scroll down, add a short note like "Updated products", and click **Commit changes**.

*Done! Your live site will update in about 30-60 seconds.*

---

## Need Help?
If you're stuck on a specific step, just let me know and I'll walk you through it!
