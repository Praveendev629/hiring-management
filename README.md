# 🎓 Candidate Shortlisting & Interview Management — Android App

Full-stack mobile application built with **Expo (React Native)** frontend
and an **Express.js** REST API backend.

---

## 📁 Project Structure

```
hiring-app/
│
├── backend/                    ← Express.js REST API
│   ├── server.js               ← Entry point (port 4000)
│   ├── package.json
│   ├── store/
│   │   └── data.js             ← In-memory data store + seed data
│   └── routes/
│       ├── candidates.js
│       ├── interviewers.js
│       ├── assessments.js
│       ├── interviews.js
│       └── reports.js
│
└── mobile/                     ← Expo React Native app
    ├── App.js                  ← Root component
    ├── app.json                ← Expo config
    ├── babel.config.js
    ├── package.json
    └── src/
        ├── api/
        │   └── client.js       ← Axios API client (BASE_URL here)
        ├── components/
        │   ├── theme.js        ← Colors, shadows, fonts
        │   └── UIComponents.js ← Shared Card, Button, Input, Badge…
        └── screens/
            ├── HomeScreen.js
            ├── candidates/
            │   ├── CandidateListScreen.js
            │   └── RegisterCandidateScreen.js
            ├── interviewers/
            │   ├── InterviewerListScreen.js
            │   └── AddInterviewerScreen.js
            ├── assessments/
            │   └── RecordAssessmentScreen.js
            ├── interviews/
            │   ├── InterviewListScreen.js
            │   └── AssignInterviewScreen.js
            └── reports/
                └── ReportsScreen.js
```

---

## ✅ Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18 LTS + | https://nodejs.org |
| npm | 9 + | included with Node |
| Expo CLI | latest | `npm install -g expo-cli` |
| Expo Go App | latest | Android Play Store / iOS App Store |

---

## 🚀 Step-by-Step Setup

### STEP 1 — Unzip the project

```bash
unzip hiring-app.zip
cd hiring-app
```

---

### STEP 2 — Start the Backend

```bash
cd backend
npm install
npm start
```

Expected output:
```
🚀  Hiring API running on http://localhost:4000
   Health → http://localhost:4000/api/health
```

> 💡 For development with auto-reload: `npm run dev` (uses nodemon)

**Verify** the API is working:
```
http://localhost:4000/api/health          → { "status": "OK" }
http://localhost:4000/api/candidates      → [ list of candidates ]
```

---

### STEP 3 — Configure the Mobile App's API URL

Open `mobile/src/api/client.js` and update `BASE_URL`:

```js
// Android Emulator (default)
const BASE_URL = 'http://10.0.2.2:4000/api';

// iOS Simulator
const BASE_URL = 'http://localhost:4000/api';

// Physical Device (phone on same Wi-Fi)
const BASE_URL = 'http://YOUR_COMPUTER_IP:4000/api';
```

**Finding your computer's IP:**
- Windows: open CMD → `ipconfig` → look for IPv4 Address
- macOS/Linux: open Terminal → `ifconfig` → look for `inet` on `en0`

---

### STEP 4 — Start the Mobile App

```bash
cd ../mobile
npm install
npx expo start
```

A **QR code** will appear in the terminal.

---

### STEP 5 — Open on Android

**Option A — Physical Android Device (recommended)**
1. Install **Expo Go** from the Play Store
2. Open Expo Go → tap **"Scan QR Code"**
3. Point camera at the terminal QR code
4. App loads instantly ✅

**Option B — Android Emulator**
1. Install Android Studio → set up an emulator (Pixel 6, API 33+)
2. Start the emulator from Android Studio
3. In the Expo terminal, press **`a`** to open on emulator
4. `BASE_URL` should be `http://10.0.2.2:4000/api` (already set)

**Option C — iOS Simulator (Mac only)**
1. Install Xcode from the Mac App Store
2. In the Expo terminal, press **`i`**
3. Use `BASE_URL = 'http://localhost:4000/api'`

---

## 📱 App Features & Navigation

### Bottom Tab Bar
```
🏠 Home  │  👤 Candidates  │  🧑‍💼 Interviewers  │  📝 Assessments  │  📅 Interviews  │  📊 Reports
```

### 🏠 Home Dashboard
- Live stats cards: total candidates, interviewers, interviews, pending
- Quick action buttons for every feature
- Pull-to-refresh

### 👤 Candidates
- **List**: Search by name/college, colour-coded CGPA, FAB to add
- **Register**: Validated form — name, college, CGPA (0–10)

### 🧑‍💼 Interviewers
- **List**: Avatar with initials, coloured by index
- **Add**: Single name field with validation

### 📝 Assessments
- Candidate picker with search filter
- DSA / Aptitude toggle
- Score (1–10) + date (not future) validation

### 📅 Interviews
- **List**: Colour-coded by status, inline Update button
- Status transitions via Alert sheet:
  `Scheduled → Completed → Selected / Rejected`
- **Assign**: Pick candidate + interviewer, set future date

### 📊 Reports (4 tabs)
| Tab | Description |
|-----|-------------|
| 📋 Detail | All assessments for one candidate + average |
| 🧑‍💼 Per IV | Unique candidate count per interviewer |
| 🏆 Top | Candidates ranked by average assessment score |
| 🗄️ SQL | Equivalent SQL query + live results sorted by CGPA |

---

## 🌐 Backend API Reference

Base URL: `http://localhost:4000/api`

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | List all |
| GET | `/candidates/:id` | Get one |
| POST | `/candidates` | Register `{ name, college, cgpa }` |

### Interviewers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/interviewers` | List all |
| POST | `/interviewers` | Add `{ name }` |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assessments?cid=1` | Get by candidate |
| POST | `/assessments` | Record `{ cid, type, score, date }` |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/interviews` | List all (with names) |
| POST | `/interviews` | Assign `{ cid, iid, date }` |
| PATCH | `/interviews/:id/status` | Update `{ status }` |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/candidate-assessments/:cid` | Detail |
| GET | `/reports/per-interviewer` | Count per IV |
| GET | `/reports/top-candidates` | Sorted by avg score |
| GET | `/reports/sql` | SQL query + results |

---

## ⚙️ Business Rules (enforced in both backend & frontend)

| Rule | Detail |
|------|--------|
| Name required | Candidate & interviewer names cannot be blank |
| CGPA | 0.0 – 10.0 |
| Score | 1 – 10 |
| Assessment date | Cannot be in the future |
| Interview date | Cannot be in the past |
| Dependency | Candidate must exist before assessment |
| Dependency | Both parties must exist before interview |
| Status flow | Scheduled → Completed → Selected / Rejected |
| Terminal status | Selected / Rejected are final — no further changes |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Network request failed` on device | Ensure phone & computer are on the **same Wi-Fi** and `BASE_URL` uses your computer's IP |
| `ECONNREFUSED` on emulator | Make sure backend is running; use `10.0.2.2` not `localhost` for Android emulator |
| QR code not scanning | Press `tunnel` in Expo menu (slower but works across networks) |
| `Module not found` errors | Run `npm install` inside both `backend/` and `mobile/` |
| Port 4000 in use | Change `PORT` in `backend/server.js` and update `BASE_URL` in `client.js` |
| Expo version mismatch | Run `npx expo install` in `mobile/` to fix dependency versions |

---

## 📌 Quick Commands Reference

```bash
# Backend
cd backend && npm install && npm start

# Mobile
cd mobile && npm install && npx expo start

# Open on Android emulator (from Expo terminal)
Press  a

# Open on iOS simulator (Mac only, from Expo terminal)
Press  i

# Scan QR on physical device
Open Expo Go app → Scan QR
```
