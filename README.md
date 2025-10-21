# 🏙️ The Caravan Chronicle  
### *Tracking and fixing the city’s daily troubles — even on the move.*

---

## 📖 Overview

**The Caravan Chronicle** is a grievance redressal and city management system designed for the *Circus of Wonders* — a traveling circus that functions like a small, mobile city.

Citizens (performers, vendors, and roadies) face everyday civic issues such as damaged roads, water leakage, or uncollected garbage.  
This platform provides them with a structured way to **report issues**, **track resolutions**, and **monitor transparency** — ensuring the circus city runs as smoothly as its shows.

---

## 🧩 Problem Statement

The Circus of Wonders’ infrastructure often faces breakdowns as it moves from one location to another. Complaints and maintenance requests get lost in the daily chaos, lowering morale and efficiency.  

You, appointed as the **Grounds Manager**, are responsible for developing a **grievance tracking system** that lets citizens raise issues, staff resolve them, and admins monitor performance — all through a centralized web platform.

---

## 🎯 Objectives

- Enable **citizens** to easily report and track civic issues.  
- Allow **staff** to efficiently manage, assign, and resolve complaints.  
- Provide **admins** with transparency, analytics, and performance tracking.  
- Enhance **accountability** and **response efficiency** with automation.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TailwindCSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Token) |
| **Maps / Visualization** | Leaflet.js or Google Maps API |
| **Reports** | jsPDF / CSV Export |
| **Notifications** | Nodemailer / Twilio / Firebase Cloud Messaging |

---

## 🏗️ System Architecture


|                 Frontend (React)                  |
|---------------------------------------------------|
|  - Citizen Portal                                 |
|  - Staff/Admin Dashboard                          |
|  - Map Visualization (Leaflet)                    |


|           Backend (Node.js + Express)             |
|---------------------------------------------------|
|  - RESTful APIs for Auth, Complaints, Reports     |
|  - JWT Authentication Middleware                  |
|  - SLA Tracking & Escalation Jobs (Cron)          |


|                  MongoDB Database                 |
|---------------------------------------------------|
|  - Users Collection                               |
|  - Complaints Collection                          |
|  - Notifications Collection                       |

---

## 🌟 Features

### 🧱 Basic Features
1. **User Registration & Login** — Secure JWT-based authentication for citizens, staff, and admins.  
2. **Complaint Submission** — Citizens can submit issues with text, photo upload, location, and category.  
3. **Ticket Lifecycle** — Complaints move through status stages: `OPEN → IN_PROGRESS → RESOLVED`.  
4. **Municipal Dashboard** — Staff can view, assign, and update complaint statuses.  
5. **Search & Filtering** — Filter complaints by type, urgency, area, or date.  
6. **Citizen Portal** — Citizens can track their submitted complaints and get live updates.  
7. **Role-Based Access** — Different dashboards for Citizens, Staff, and Admin.  
8. **Reports** — Generate monthly CSV/PDF reports of all complaints.

---

### ⚙️ Advanced Features
1. **Heatmap Visualization** — Interactive map displaying complaint density by location.  
2. **SLA Tracking** — Monitor how long complaints stay unresolved and highlight overdue issues.  
3. **Escalation System** — Automatically escalate unresolved complaints after SLA breach.  
4. **Public Transparency Portal** — Show live statistics (resolved vs pending, average resolution time).  
5. **Notifications** — SMS/email/push alerts for status updates and overdue reminders.

---

## 🧠 Database Schema

### 🗂️ User Model
```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  role: { type: String, enum: ['citizen', 'staff', 'admin'], default: 'citizen' },
  createdAt: Date
}
```

##🗂️ Complaint Model
```js
{
  _id: ObjectId,
  title: String,
  description: String,
  category: { type: String, enum: ['Road Damage', 'Water Leakage', 'Garbage', 'Other'] },
  location: { lat: Number, lng: Number },
  photoUrl: String,
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], default: 'OPEN' },
  createdBy: { type: ObjectId, ref: 'User' },
  assignedTo: { type: ObjectId, ref: 'User' },
  createdAt: Date,
  updatedAt: Date,
  slaDeadline: Date,
  resolutionTime: Date
}
```

##🗂️ Notification Model
```js
{
  userId: { type: ObjectId, ref: 'User' },
  message: String,
  type: { type: String, enum: ['status_update', 'reminder', 'escalation'] },
  isRead: Boolean,
  createdAt: Date
}
```

| Method  | Endpoint                     | Description                | Auth          |
| ------- | ---------------------------- | -------------------------- | ------------- |
| `POST`  | `/api/auth/register`         | Register a new user        | ❌             |
| `POST`  | `/api/auth/login`            | Login and get JWT          | ❌             |
| `POST`  | `/api/complaints`            | Submit a complaint         | ✅ Citizen     |
| `GET`   | `/api/complaints`            | View all complaints        | ✅ Staff/Admin |
| `GET`   | `/api/complaints/mine`       | View user’s own complaints | ✅ Citizen     |
| `PATCH` | `/api/complaints/:id/status` | Update complaint status    | ✅ Staff       |
| `GET`   | `/api/reports/monthly`       | Generate CSV/PDF reports   | ✅ Admin       |
| `GET`   | `/api/analytics/heatmap`     | Complaint heatmap data     | ✅ Admin       |

---

## 🧭 Installation & Setup

### Prerequisites
- **Node.js** 18+ and **npm**
- **Git**
- **MongoDB** (Atlas account or local MongoDB 6+)
- **SMTP credentials** for email (e.g., Gmail App Password, SendGrid)
- (Optional) **Twilio/FCM** credentials for SMS/Push notifications

### 1. Clone the Repository
```bash
git clone https://github.com/gaurav9479/The-Caravan-Chronicle.git
cd The-Caravan-Chronicle
```

### 2. Install Dependencies
- **Backend**
```bash
cd server
npm install
```
- **Frontend**
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside `server`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<your-uri>
JWT_SECRET=<your-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>
```

Optional (if frontend needs to call a custom API base URL): create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Database Setup (MongoDB)
- **Option A: MongoDB Atlas (recommended for dev/test)**
  - Create a Project and a free Cluster
  - Create a Database User and note the password
  - Network Access: allow your IP (or `0.0.0.0/0` for development only)
  - Copy the connection string and paste it into `MONGO_URI`
- **Option B: Local MongoDB**
  - Install MongoDB Community Edition and start the service
  - Use `mongodb://127.0.0.1:27017/caravan_chronicle` as `MONGO_URI`

Collections are created automatically by Mongoose at runtime. For better query performance, create these indexes (in `mongosh` after selecting your database):
```js
// Users: unique email
db.users.createIndex({ email: 1 }, { unique: true });

// Complaints: common query paths
db.complaints.createIndex({ createdAt: -1 });
db.complaints.createIndex({ status: 1 });
db.complaints.createIndex({ assignedTo: 1 });
db.complaints.createIndex({ category: 1 });
db.complaints.createIndex({ "location.lat": 1, "location.lng": 1 });
```

Optional: seed an initial admin (after backend is running):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"ChangeMe123!","role":"admin"}'
```

### 5. Run the Project
- **Backend**
```bash
cd server
npm start
```
- **Frontend**
```bash
cd ../client
npm run dev
```

### 6. Access the App
Open your browser at: `http://localhost:5173`

### 7. Troubleshooting
- **Mongo connection error**: verify `MONGO_URI`, IP allowlist (Atlas), and network connectivity
- **JWT errors**: ensure `JWT_SECRET` is set and consistent across runs
- **Email failures**: use app passwords or provider-specific SMTP creds; avoid plain Gmail passwords
- **Port in use**: change `PORT` in `server/.env` or stop the conflicting process

---

## 📊 Reports & Visualization
- **Monthly Reports**: Export complaint data as CSV/PDF
- **Heatmap Dashboard**: Interactive map showing complaint hotspots
- **Transparency Stats**: Public metrics of pending vs resolved cases

## 🧩 Future Enhancements
- **Voice-based complaint submission**
- **AI-driven auto categorization**
- **Offline-first mobile PWA**
- **Gamified citizen participation system**
- **Predictive analytics for recurring issues**

## 🔒 Roles & Access
| Role | Access |
| --- | --- |
| **Citizen** | File & track complaints |
| **Staff** | Assign, update, resolve complaints |
| **Admin** | Manage users, oversee SLA & reports |

## 🧾 License
This project is open source under the **MIT License**.

## 🙌 Credits
Developed by **Gaurav Prajapati** for the Circus of Wonders. Built with ❤️ using **React**, **Node.js**, and **MongoDB**.

---

## 🧭 Implementation Guide

### High-level Scope
- **MVP**
  - Auth (JWT): register, login, logout
  - Citizen: create complaint, list my complaints, view detail
  - Staff: list/assign complaints, update status `OPEN → IN_PROGRESS → RESOLVED`
  - Admin: list all complaints, basic filters, monthly CSV/PDF export
  - Map: plot complaints with clustering
- **V1**
  - Heatmap, SLA tracking, escalation, email notifications, transparency stats

### Architecture & Folder Structure
Backend (`server`)
```text
server/
  src/
    config/            # db, mailer, env
    middleware/        # auth, error, role-guard, rate-limit
    models/            # User, Complaint, Notification
    controllers/       # authController, complaintController, reportController
    routes/            # /auth, /complaints, /reports, /analytics
    jobs/              # cron jobs for SLA & escalation
    utils/             # email, csv/pdf, pagination, logger
    index.js           # express app bootstrap
```

Frontend (`client`)
```text
client/
  src/
    api/               # axios client, hooks (React Query)
    auth/              # AuthContext, ProtectedRoute
    components/        # UI components
    features/
      auth/            # pages: Login, Register
      citizen/         # pages: NewComplaint, MyComplaints
      staff/           # pages: Queue, Assign, Update
      admin/           # pages: Dashboard, Reports, Heatmap
      shared/          # common widgets (Table, Filters, Map)
    pages/             # route shells
    router/            # route config
    index.css          # Tailwind
    main.jsx
```

### Data Models (MongoDB)
- **User**: name, email (unique), password (hashed), role: `citizen|staff|admin`, createdAt
- **Complaint**: title, description, category, location{lat,lng}, photoUrl, status, createdBy, assignedTo, createdAt, updatedAt, slaDeadline, resolutionTime
- **Notification**: userId, message, type, isRead, createdAt
- **Indexes**: `users.email` unique; `complaints.createdAt`, `status`, `assignedTo`, `category`, `location.lat/lng`

### API Design (REST)
- **Auth**
  - `POST /api/auth/register` {name,email,password,role?} → {token,user}
  - `POST /api/auth/login` {email,password} → {token,user}
- **Complaints**
  - `POST /api/complaints` {title,description,category,location,photoUrl?}
  - `GET /api/complaints/mine` → user’s complaints (citizen)
  - `GET /api/complaints` → all (staff/admin), filters: status, category, assignedTo, date range, pagination
  - `PATCH /api/complaints/:id/status` {status, assignedTo?} (staff)
- **Reports**
  - `GET /api/reports/monthly?month=YYYY-MM` → CSV/PDF
- **Analytics**
  - `GET /api/analytics/heatmap?from&to` → [{lat,lng,count}]

Standards: Bearer auth header, validation (`zod`/`express-validator`), pagination `?page&limit`, centralized error responses `{message, code, details}`.

### Backend Approach
- **Auth**: bcrypt hash, JWT issue/verify, `requireAuth`, `requireRole('staff'|'admin')`
- **Complaints**: citizen create (status=OPEN, compute `slaDeadline`), role-based lists, staff updates; set `resolutionTime` on RESOLVED
- **Jobs**: cron to detect SLA breaches, mark escalations, enqueue notifications
- **Notifications**: start with Nodemailer SMTP; adapters later for Twilio/FCM
- **Reports**: CSV via `fast-csv`; PDF via `pdfkit`/`puppeteer` (optional)
- **Security**: rate-limit, Helmet, CORS allowlist, validation, upload sanitization

### Frontend Approach
- **State/Data**: React Query + axios interceptor carrying JWT
- **Routing**: React Router with public and role-guarded routes
- **UI**: Tailwind; Leaflet map with clusters/heatmap
- **Pages**: Login/Register; Citizen (New, My); Staff (Queue/Assign/Update); Admin (Dashboard, Heatmap, Reports)
- **UX**: forms validation, toasts, skeletons, pagination, debounced search

### Environments & Config
- `server/.env`: PORT, MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS
- `client/.env`: VITE_API_BASE_URL
- Build/Run: Backend `npm run dev`, Frontend `npm run dev`
- MCP: optional `mongodb-mcp-server` for DB exploration (read/write)

### Testing
- Backend: Jest unit (controllers/utils), Supertest integration
- Frontend: Vitest unit for components/hooks, Playwright/Cypress E2E

### Observability
- Logging: morgan (dev), later pino; optional Sentry; optional Prometheus metrics

### Milestones
- **M1 (MVP)**: Auth, Complaints (create/list/mine/status), Admin list, CSV export, basic UI
- **M2**: Heatmap + Leaflet, SLA job + email escalation
- **M3**: PDF export, transparency stats, filters/pagination polish, notifications center

### Concrete Next Steps
1. Backend: implement `User`, `Complaint` models + indexes; `/auth`, `/complaints` routes/controllers; `requireAuth`/`requireRole`
2. Frontend: AuthContext + axios; pages for Login/Register, New Complaint, My Complaints, Staff Queue, Admin List
3. Heatmap + SLA: `/analytics/heatmap` + Leaflet; cron for SLA escalation + email adapter
4. Reports: CSV first, then PDF

---

## 🧩 MCP Server (MongoDB) Integration

Use this if you're connecting MongoDB to an MCP client (e.g., Cursor). The password below is URL‑encoded for safety.

### Password encoding
Raw password: `Gaurav@2005` → URL‑encoded: `Gaurav%402005`

### Connection string (read‑write)
```text
mongodb+srv://gauravsprajapati:Gaurav%402005@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle
```

### Start MCP server (read‑write)
Run in your terminal (omit `--readOnly` for write access):
```bash
npx -y mongodb-mcp-server \
  --connectionString "mongodb+srv://gauravsprajapati:Gaurav%402005@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle"
```

### Optional MCP JSON config
```json
{
  "mcpServers": {
    "MongoDB": {
      "command": "npx",
      "args": [
        "-y",
        "mongodb-mcp-server",
        "--connectionString",
        "mongodb+srv://gauravsprajapati:Gaurav%402005@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle"
      ]
    }
  }
}
```

### Backend `.env` example
Update `server/.env` to use the same DB (read‑write):
```env
MONGO_URI=mongodb+srv://gauravsprajapati:Gaurav%402005@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle
```
