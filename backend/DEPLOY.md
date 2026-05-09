# 🚀 Backend Deployment Guide — Render.com (Free)

## Why Render?
- ✅ 100% Free tier for Node.js web services
- ✅ Auto-deploy on every GitHub push
- ✅ HTTPS URL out of the box (no config needed)
- ✅ No credit card required

---

## STEP 1 — Push Backend to GitHub

### 1a. Create a GitHub account (if you don't have one)
→ https://github.com/signup

### 1b. Create a new repository
1. Go to https://github.com/new
2. Repository name: `hiring-system-backend`
3. Set to **Public**
4. Click **Create repository**

### 1c. Push the backend folder

Open a terminal inside the `backend/` folder:

```bash
cd hiring-app/backend

git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hiring-system-backend.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

## STEP 2 — Deploy on Render

### 2a. Sign up / Log in
→ https://render.com  
Click **Sign up with GitHub** (easiest — links your repos automatically)

### 2b. Create a New Web Service
1. From the Render Dashboard click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select **`hiring-system-backend`**
4. Click **Connect**

### 2c. Configure the Service

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `hiring-system-api` |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | **Free** |

### 2d. Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

> `PORT` is set automatically by Render — do NOT add it manually.

### 2e. Click "Create Web Service"

Render will:
1. Clone your GitHub repo ✅
2. Run `npm install` ✅
3. Start `node server.js` ✅
4. Give you a live HTTPS URL like:
   ```
   https://hiring-system-api.onrender.com
   ```

⏱ First deploy takes ~2–3 minutes.

---

## STEP 3 — Verify It's Live

Open these URLs in your browser:

```
https://hiring-system-api.onrender.com/api/health
→ { "status": "OK", "timestamp": "..." }

https://hiring-system-api.onrender.com/api/candidates
→ [ list of demo candidates ]
```

✅ If you see JSON — your backend is live!

---

## STEP 4 — Update the Mobile App

Open `mobile/src/api/client.js` and replace `BASE_URL`:

```js
// ❌ Old (local only)
const BASE_URL = 'http://10.0.2.2:4000/api';

// ✅ New (live Render URL)
const BASE_URL = 'https://hiring-system-api.onrender.com/api';
```

Save the file and restart Expo (`npx expo start`) — the app now talks to the live server from anywhere in the world! 🌍

---

## ⚠️ Free Tier Notes

| Limitation | Detail |
|------------|--------|
| **Spin-down** | Free services sleep after 15 min of inactivity. First request after sleep takes ~30s to wake up. |
| **750 hrs/month** | Enough for one always-on service (30 days × 24h = 720h) |
| **Memory** | 512 MB RAM — more than enough for this app |
| **No persistent disk** | In-memory data resets on redeploy (by design for this project) |

**To prevent spin-down (optional):** Use a free uptime monitor like https://uptimerobot.com to ping `/api/health` every 10 minutes.

---

## 🔁 Auto-Deploy (Bonus)

Every time you `git push` to `main`, Render **automatically redeploys** — no manual steps needed.

```bash
# Make a change, then:
git add .
git commit -m "Update something"
git push origin main
# → Render redeploys in ~1 minute automatically
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| Deploy failed | Check Render logs → click your service → "Logs" tab |
| `npm install` fails | Make sure `package.json` is in the repo root (not a subfolder) |
| App shows "Network Error" | Double-check `BASE_URL` in `client.js` matches your Render URL exactly |
| CORS error in browser | Already handled — `cors()` middleware is configured in `server.js` |
| Service sleeping | Add UptimeRobot monitor for `/api/health` |

---

## 📋 Full API Endpoint Reference (Live)

Replace `https://hiring-system-api.onrender.com` with your actual Render URL.

```
GET    /api/health
GET    /api/candidates
POST   /api/candidates            { name, college, cgpa }
GET    /api/interviewers
POST   /api/interviewers          { name }
GET    /api/assessments?cid=1
POST   /api/assessments           { cid, type, score, date }
GET    /api/interviews
POST   /api/interviews            { cid, iid, date }
PATCH  /api/interviews/:id/status { status }
GET    /api/reports/candidate-assessments/:cid
GET    /api/reports/per-interviewer
GET    /api/reports/top-candidates
GET    /api/reports/sql
```
