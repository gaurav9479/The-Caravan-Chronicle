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
6. **Staff Performance Tracking** — Work area management, contact info, and performance analytics.
7. **Rating & Review System** — Citizens rate staff (1-5 stars) after resolution with detailed feedback.
8. **Advanced Filtering** — Filter complaints/reviews by status, dates, department, assignee across all views.
9. **Location-Aware Assignment** — OLA/Uber-style staff selection based on proximity and availability.
10. **Real-Time Staff Discovery** — Citizens see nearby available staff with ratings and estimated arrival times.
11. **Robust Phone Validation** — International phone number validation with country codes and formatting.
12. **Enhanced Profile Management** — Universal profile editing with role-aware fields and real-time validation.
13. **Geolocation Integration** — "Use my current location" buttons with HTML5 geolocation API.

---

## 🧠 Database Schema

### 📊 Collections Overview

The system uses **4 main collections** in MongoDB, designed to handle the complete lifecycle of civic complaints from submission to resolution, with comprehensive user management and performance tracking.

| Collection | Purpose | Key Relationships |
|------------|---------|-------------------|
| **Users** | All user accounts (citizens, staff, admins) | Self-referential (staff assignments), Departments |
| **Complaints** | All civic complaints and their lifecycle | Users (created by, assigned to), Departments |
| **Departments** | 47 civic departments with categories | Users (department staff) |
| **Reviews** | Citizen feedback on staff performance | Users (staff, citizen), Complaints |

---

### 🗂️ User Model (`users` collection)

**Purpose**: Central user management for all roles (citizens, staff, admins) with role-based fields.

```js
{
  _id: ObjectId,                    // MongoDB ObjectId
  name: String,                      // Full name (required)
  email: String,                     // Unique email (lowercase, required)
  password: String,                  // Hashed with bcrypt (required)
  role: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen'
  },
  departmentId: {
    type: ObjectId,
    ref: 'Department'               // Staff only: their department
  },

  // 🔧 Staff-specific fields (only populated for role: 'staff')
  staff: {
    title: String,                   // Job title (e.g., "Field Engineer")
    skills: [String],                // Array of skills (e.g., ['paving', 'pipes'])
    shiftStart: String,              // Work hours (e.g., '09:00')
    shiftEnd: String,                // Work hours (e.g., '18:00')
    isWorkingToday: {
      type: Boolean,
      default: true                 // Staff availability toggle
    },
    workArea: {
      city: String,                 // City name
      zones: [String],              // Work zones (e.g., ['Zone A', 'North District'])
      location: {
        lat: Number,               // Work area coordinates (required for staff)
        lng: Number
      }
    },
    contactPhone: String,            // 📞 Public contact phone for citizens
    contactEmail: String             // 📧 Public contact email for citizens
  },

  // ⭐ Performance tracking
  ratings: {
    average: { type: Number, default: 0 },  // Average rating (1-5)
    count: { type: Number, default: 0 }     // Total reviews received
  },

  // 👤 Personal profile information
  profile: {
    avatarUrl: String,               // Profile picture URL
    phone: String,                   // 📱 Personal phone number (private)
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String
    },
    bio: String                      // Personal description
  },

  createdAt: Date,                   // Account creation timestamp
  updatedAt: Date                    // Last profile update
}
```

**Key Features**:
- **Role-based schema**: Staff fields only exist for staff users
- **Dual contact system**: Personal phone (private) vs contact phone (public for citizens)
- **Geolocation support**: Precise work area coordinates for location-aware assignments
- **Performance tracking**: Built-in rating system with averages and counts

---

### 🗂️ Complaint Model (`complaints` collection)

**Purpose**: Complete lifecycle management of civic complaints from submission to resolution.

```js
{
  _id: ObjectId,                    // MongoDB ObjectId
  title: String,                     // Brief complaint title (required)
  description: String,               // Detailed description (required)
  category: String,                  // From 47 available categories (required)
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },

  // 📍 Location data (geographic coordinates + reporter info)
  location: {
    lat: Number,                     // Latitude (from map picker or geolocation)
    lng: Number                      // Longitude (from map picker or geolocation)
  },
  attachments: [{                    // Photo evidence
    url: String,                     // Image URL
    type: String                     // MIME type
  }],

  // 🔄 Status lifecycle management
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
    default: 'OPEN'
  },

  // 👥 Assignment and ownership
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true                   // Citizen who filed the complaint
  },
  reporterSnapshot: {                // Reporter contact info at time of filing
    name: String,
    phone: String,                   // Optional reporter phone
    email: String                    // Optional reporter email
  },
  assignedDepartmentId: {
    type: ObjectId,
    ref: 'Department'
  },
  assignedTo: {
    type: ObjectId,
    ref: 'User'                      // Staff member assigned to resolve
  },

  // ⏰ SLA and deadline tracking
  slaDeadline: Date,                 // When complaint becomes overdue
  resolutionTime: Date,              // When actually resolved

  // 📋 Status change history and escalations
  statusHistory: [{
    at: { type: Date, default: Date.now },
    by: { type: ObjectId, ref: 'User' },
    from: String,                    // Previous status
    to: String,                      // New status
    note: String                     // Optional note about the change
  }],
  escalations: [{
    level: Number,                   // Escalation level (1, 2, 3...)
    at: Date,                        // When escalated
    to: { type: ObjectId, ref: 'User' }  // Who it was escalated to
  }],

  createdAt: Date,                   // When complaint was filed
  updatedAt: Date                    // Last status change
}
```

**Key Features**:
- **Complete audit trail**: Every status change is recorded with timestamp and user
- **SLA management**: Automatic deadline calculation based on department policies
- **Escalation system**: Multi-level escalation for overdue complaints
- **Flexible attachments**: Support for multiple photos/evidence
- **Reporter anonymity**: Optional contact information for citizens

**Performance Indexes**:
```js
// Common query patterns for efficient searching
db.complaints.createIndex({ createdAt: -1 });           // Recent complaints first
db.complaints.createIndex({ status: 1 });              // Filter by status
db.complaints.createIndex({ assignedDepartmentId: 1 }); // Department assignments
db.complaints.createIndex({ assignedTo: 1 });          // Staff assignments
db.complaints.createIndex({ category: 1 });            // Category filtering
db.complaints.createIndex({ "location.lat": 1, "location.lng": 1 }); // Geospatial queries
```

---

### 🗂️ Department Model (`departments` collection)

**Purpose**: Define the 47 civic departments and their responsibilities.

```js
{
  _id: ObjectId,                    // MongoDB ObjectId
  name: String,                      // Department name (e.g., "Road Maintenance")
  code: {                            // Unique department code
    type: String,
    required: true,
    unique: true                     // e.g., "ROAD_MAINT", "WATER_SUP"
  },
  categoriesHandled: {               // Complaint categories this dept handles
    type: [String],
    index: true,                     // Indexed for fast category lookups
    default: []
  },
  slaPolicyHours: {                  // Service level agreement in hours
    type: Number,
    default: 72                      // 3 days default
  },
  managerId: {
    type: ObjectId,
    ref: 'User'                      // Department manager (admin/staff)
  },
  contactEmail: String,              // Department contact email
  contactPhone: String,              // Department contact phone

  createdAt: Date,
  updatedAt: Date
}
```

**47 Available Departments**:
- **Roads & Infrastructure**: Road Maintenance, Traffic Management, Street Lighting, etc.
- **Water & Sanitation**: Water Supply, Sewage Treatment, Waste Management, etc.
- **Parks & Recreation**: Parks & Gardens, Playgrounds, Tree Maintenance, etc.
- **Public Safety**: Fire Services, Emergency Medical, Police Services, etc.
- **Building & Planning**: Building Permits, Code Enforcement, Zoning, etc.
- **Utilities & Energy**: Electricity Distribution, Gas Services, Telecommunications, etc.
- **Community Services**: Public Health, Social Services, Education, etc.
- **Administrative**: Customer Service, IT, Finance, Legal Services

---

### 🗂️ Review Model (`reviews` collection)

**Purpose**: Citizen feedback system for staff performance evaluation.

```js
{
  _id: ObjectId,                    // MongoDB ObjectId
  complaintId: {
    type: ObjectId,
    ref: 'Complaint',
    required: true
  },
  staffId: {
    type: ObjectId,
    ref: 'User',
    required: true                   // Staff member being reviewed
  },
  citizenId: {
    type: ObjectId,
    ref: 'User',
    required: true                   // Citizen who gave the review
  },

  // ⭐ Rating components (1-5 scale)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5                          // Overall satisfaction rating
  },
  comment: {
    type: String,
    trim: true                       // Optional text feedback
  },
  resolutionQuality: {
    type: Number,
    min: 1,
    max: 5                          // How well was the issue fixed?
  },
  timeliness: {
    type: Number,
    min: 1,
    max: 5                          // How quickly was it resolved?
  },
  communication: {
    type: Number,
    min: 1,
    max: 5                          // How well did staff communicate?
  },

  createdAt: Date,                   // When review was submitted
  updatedAt: Date
}
```

**Key Features**:
- **One review per complaint**: Unique constraint ensures each complaint gets one review
- **Multi-dimensional ratings**: Separate scores for quality, timeliness, and communication
- **Staff performance tracking**: Reviews automatically update staff ratings in User model

**Performance Indexes**:
```js
db.reviews.createIndex({ staffId: 1 });           // Staff performance queries
db.reviews.createIndex({ complaintId: 1 }, { unique: true }); // One review per complaint
```

---

### 🔗 Data Relationships & Flow

```
Citizens (Users) → File Complaints → Get Assigned to Staff (Users)
     ↓                    ↓                        ↓
Departments ← Categories ← Complaints ← Reviews ← Citizens
     ↑                    ↑                        ↑
Staff work in ← Departments handle ← Categories ← Complaints get ← Reviews from
```

**Key Relationships**:
1. **User ↔ Department**: Many-to-one (staff belong to departments)
2. **User ↔ Complaint**: One-to-many (citizens file multiple complaints, staff handle multiple)
3. **Complaint ↔ Department**: Many-to-one (multiple complaints in one department)
4. **Complaint ↔ Review**: One-to-one (each resolved complaint gets one review)
5. **User ↔ Review**: Many-to-many (staff receive reviews, citizens give reviews)

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

Collections are created automatically by Mongoose at runtime. **Indexes are also created automatically** based on schema definitions for optimal query performance:

**Automatic Indexes Created**:
```js
// Users collection - for authentication and performance
db.users.createIndex({ email: 1 }, { unique: true });    // Unique email constraint

// Complaints collection - for efficient querying
db.complaints.createIndex({ createdAt: -1 });           // Recent complaints first
db.complaints.createIndex({ status: 1 });              // Filter by status
db.complaints.createIndex({ assignedDepartmentId: 1 }); // Department assignments
db.complaints.createIndex({ assignedTo: 1 });          // Staff assignments
db.complaints.createIndex({ category: 1 });            // Category filtering
db.complaints.createIndex({ "location.lat": 1, "location.lng": 1 }); // Geospatial queries

// Departments collection - for category lookups
db.departments.createIndex({ categoriesHandled: 1 });  // Fast category matching

// Reviews collection - for performance tracking
db.reviews.createIndex({ staffId: 1 });               // Staff performance queries
db.reviews.createIndex({ complaintId: 1 }, { unique: true }); // One review per complaint
```

**Note**: These indexes are created automatically when the application starts. No manual index creation required!

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

## 📦 Dependencies

### Backend
- **express** — Web framework
- **mongoose** — MongoDB ODM
- **cors** — Cross-origin resource sharing
- **dotenv** — Environment variables
- **morgan** — HTTP request logger
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT token management
- **multer** — File upload handling
- **nodemailer** — Email sending

### Frontend
- **react** — UI library
- **react-router-dom** — Client-side routing
- **axios** — HTTP client
- **leaflet** — Interactive maps
- **react-leaflet** — React wrapper for Leaflet
- **tailwindcss** — Utility-first CSS framework
- **react-phone-number-input** — International phone number input with validation
- **libphonenumber-js** — Robust phone number parsing and validation

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
- `server/.env`: PORT, MONGO_URI, JWT_SECRET, REDIS_URL, EMAIL_USER, EMAIL_PASS
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

## 🚀 Staff Work Tracking & Ratings

### Features
- **Staff Profile Management**: Work area, contact info, skills, and performance tracking
- **Complaint Assignment**: Auto-assign complaints to departments based on category
- **Progress Tracking**: Full audit trail of status changes with timestamps and notes
- **Rating & Review System**: Citizens rate staff (1-5 stars) after complaint resolution
- **Performance Analytics**: Average ratings, review counts, and work completion tracking
- **Filtering & Search**: Filter complaints/reviews by status, dates, department, assignee

### Staff Onboarding Data
- **Work Area**: City, zones (comma-separated), precise location coordinates (map picker + geolocation)
- **Contact**: Phone, email for citizen communication with "Same as above" option
- **Skills**: Technical expertise (comma-separated)
- **Department**: Auto-assigned or selected during registration
- **Working Status**: Toggle for "working today" availability
- **Shifts**: Start and end times for work schedule

### API Endpoints for Tracking

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/reviews` | Submit rating/review for resolved complaint | ✅ Citizen |
| `GET` | `/api/reviews/staff/:id?from&to` | Get staff reviews with date filtering | ✅ Staff/Admin |
| `GET` | `/api/complaints` | List complaints with filters (status, dept, assignee, dates) | ✅ Staff/Admin |
| `GET` | `/api/complaints/staff/:id?status&from&to` | Get complaints assigned to specific staff | ✅ Staff/Admin |
| `GET` | `/api/complaints/:id` | Complaint detail with full timeline | ✅ All |
| `PATCH` | `/api/complaints/:id/status` | Update complaint status (staff/admin only) | ✅ Staff/Admin |
| `GET` | `/api/users/:id` | User profile with ratings and work area | ✅ All |

### Frontend Features
- **Staff Profile Page** (`/staff/:id`): Work area, contact, ratings, reviews, and assigned complaints
- **Complaint Detail** (`/complaints/:id`): Timeline, status history, rating submission
- **Admin Dashboard**: Staff management table with performance metrics
- **Filtering UI**: Date ranges, status filters, department filters on all list views

### Rating System
- Citizens rate staff 1-5 stars after resolution
- Detailed feedback: quality, timeliness, communication scores
- Auto-calculates average rating for staff profiles
- Reviews include complaint context and citizen anonymity

## 🗺️ Location-Aware Staff Assignment

### Features
- **Geolocation-Based Matching**: Automatically find nearby staff using Haversine distance formula
- **OLA/Uber-Style Selection**: Citizens can see and select from available staff in real-time
- **Smart Filtering**: Only shows staff who are working today and within radius
- **Performance-Based Sorting**: Staff sorted by rating (highest first) then distance (closest first)
- **Real-Time Updates**: Staff list updates as citizen moves location on map

### How It Works
1. **Location Selection**: Citizen picks complaint location on interactive map
2. **Staff Discovery**: System finds staff within 15km radius handling that category
3. **Smart Filtering**: Only shows staff who are:
   - Working today (`isWorkingToday: true`)
   - From relevant department
   - Have location coordinates
4. **Staff Selection**: Citizen sees staff cards with:
   - Name, title, and avatar
   - Star rating and review count
   - Distance from complaint location
   - Estimated arrival time (~2 min/km)
   - Skills and contact information
   - Work status indicator (🟢/🔴)
5. **Assignment**: Selected staff gets assigned and notified

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/staff/nearby?lat&lng&category&radius` | Find nearby staff for location and category | ✅ All |
| `POST` | `/api/staff/assign` | Assign selected staff to complaint | ✅ All |

---

## ⚡ Redis Caching Layer

The application uses Redis for performance optimization with strategic caching:

### **Cache Strategy**

| Route | Cache Key | TTL | Reason |
|-------|-----------|-----|--------|
| `GET /api/departments` | `departments:list` | 1 hour | Departments change infrequently |
| `GET /api/users/:id` | `user:${id}` | 15 min | User profiles accessed often |
| `GET /api/staff/nearby` | `staff:nearby:${lat}:${lng}:${category}:${radius}` | 5 min | Staff availability changes frequently |
| `GET /api/analytics/summary` | `analytics:summary` | 2 min | Admin dashboard updates |
| `GET /api/analytics/categories` | `analytics:categories` | 5 min | Category stats |
| `GET /api/analytics/heatmap` | `analytics:heatmap` | 10 min | Location data changes less frequently |

### **Cache Invalidation**

- **User profile updates**: Cache cleared on profile changes
- **Staff assignments**: Nearby staff cache cleared when staff are assigned
- **Department changes**: Would require manual cache clearing (rare)

### **Redis Configuration**

Add to `server/.env`:
```env
REDIS_URL=redis://127.0.0.1:6379
```

### Frontend Components
- **StaffSelector**: Real-time staff list with OLA/Uber-style cards
- **MapPicker**: Interactive location selection with staff updates
- **Staff Cards**: Display rating, distance, skills, contact info, and availability

### Technical Implementation
- **Haversine Formula**: Accurate distance calculation between coordinates
- **MongoDB Queries**: Efficient filtering by department, availability, and location
- **Real-Time Updates**: Staff list refreshes as location changes
- **Performance Optimization**: Sorted results with distance and rating weighting

## 📱 Enhanced User Experience

### Robust Phone Number Validation
- **Pattern Recognition**: Uses `libphonenumber-js` for international phone number validation
- **Visual Feedback**: Real-time validation with ✓/✗ indicators and formatted display
- **Consistent Implementation**: PhoneInput components across all forms (register, profile, complaints)
- **International Support**: Supports country codes and formatting for global usage

### Citizen Complaint Features
- **Current Location**: "Use my current location" button with HTML5 geolocation
- **Precise Location Selection**: Interactive map picker with coordinate display
- **Contact Information**: Optional reporter details (name, phone, email) for staff follow-up
- **Location Validation**: Ensures valid coordinates before complaint submission

### Staff Registration Enhancements
- **Contact Information Options**:
  - Regular phone/email (personal)
  - Contact phone/email (for citizen communication)
  - **"Same as above" checkbox** to copy personal info to contact fields
- **Precise Work Area**: Map picker + geolocation for exact service area
- **Work Schedule**: Shift start/end times and daily availability toggle
- **Skills Management**: Comma-separated technical expertise

### Profile Management
- **Universal Access**: All users can edit their profiles via "Edit Profile" button
- **Role-Aware Fields**: Different fields shown based on user role (citizen/staff/admin)
- **Real-Time Validation**: Phone numbers, coordinates, and required fields validated
- **Status Tracking**: Staff work availability shown across all dashboards

## 📝 Data Collection & Forms

### Onboarding Fields (by role)
- **Citizen**
  - Name; Email (verify); Password
  - Phone (optional, international validation with country codes)
  - Default location/area (optional)
  - Notification preference (email/SMS/push)
  - Accessibility needs (optional)
- **Staff**
  - Name; Email (verify); Password
  - Phone (personal, international validation)
  - Department (select from 47+ civic departments)
  - Title/role (e.g., Field Engineer)
  - Skills/tags (comma-separated technical expertise)
  - Work area (city, zones, precise coordinates via map/geolocation)
  - Shift hours (start, end times)
  - Contact phone/email (for citizen communication, with "Same as above" option)
  - Working today toggle (availability status)
- **Admin**
  - Name; Email (verify); Password
  - Scope (global or department-level)
  - Contact phone (optional)

### Complaint Submission (Citizen)
- **Required**: Title, Description, Category, Location (map pin, "Use my current location" button, or manual coordinates)
- **Optional**:
  - Priority (LOW/MEDIUM/HIGH)
  - Photos/attachments
  - Landmark/notes
  - Contact information (name, phone, email for staff follow-up)
  - Staff selection (OLA/Uber-style from nearby available staff)
  - Consent to share anonymized data

### Assignment & Workflow (Staff/Admin)
- **Location-Aware Assignment**: Automatic staff matching based on complaint location and staff work area
- **Department Assignment**: Auto-assigned by category, with citizen override option
- **Staff Selection**: Citizens can choose from nearby available staff (OLA/Uber-style)
- **Status Workflow**: `OPEN → ASSIGNED → IN_PROGRESS → RESOLVED`
- **Real-Time Updates**: Staff availability, location tracking, and status changes
- **Contact Integration**: Staff contact info visible to citizens for direct communication
- SLA override (admin only, optional)

### Analytics & Notifications
- Time range preferences (e.g., weekly digest)
- Channels (email/SMS/push)
- Escalation contacts (admin/staff leads)

### Data Quality & Validation
- **Phone Validation**: International phone number validation using `libphonenumber-js` with country code detection
- **Email Verification**: Standard email format validation (OTP/email link optional for future)
- **Location Validation**: Geocoding with precise coordinates (lat/lng) and address formatting
- **Real-Time Validation**: Visual feedback (✓/✗) for phone numbers, coordinates, and required fields
- **Attachment Handling**: Type/size limits for complaint photos and documents
- **Input Bounds**: Length limits for title, description, notes, and other text fields

---

## 🧩 MCP Server (MongoDB) Integration

Use this if you're connecting MongoDB to an MCP client (e.g., Cursor). The password below is URL‑encoded for safety.

### Password encoding
Raw password: `Gaurav@2005` → URL‑encoded: `Gaurav%402005`

### Connection string (read‑write)
```text
mongodb+srv://gauravspr5@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle
```

### Start MCP server (read‑write)
Run in your terminal (omit `--readOnly` for write access):
```bash
npx -y mongodb-mcp-server \
  --connectionString "mongodb+@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle"
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
        "mongodb+srv://gauravs:caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle"
      ]
    }
  }
}
```

### Backend `.env` example
Update `server/.env` to use the same DB (read‑write):
```env
MONGO_URI=mongodb+srv://gauravsp@caravanchroniclecluster.xu5j6lk.mongodb.net/caravan_chronicle
```

---

## 🚀 Database Performance

**Optimized Indexes** for common queries:
- **Geospatial queries**: Location-based staff assignment and complaint mapping
- **Status filtering**: Quick access to open/pending/resolved complaints
- **Department assignments**: Efficient complaint routing
- **Performance tracking**: Fast staff rating calculations
- **Time-based queries**: Recent complaints and SLA deadline monitoring

**Connection**: MongoDB Atlas (cloud) or local MongoDB with connection string in `MONGO_URI`

---

## 🔄 **Complete Workflow: From Registration to Complaint Resolution**

### 📍 **Part 1: Staff Registration Flow**

```
┌─────────────────────────────────────────────────────────────┐
│ Staff Member Registers on Platform                          │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────────────┐
    │ 1. ENTER PERSONAL INFO      │
    │  • Name                     │
    │  • Email (unique)           │
    │  • Password (hashed)        │
    │  • Personal Phone 📱        │
    │    (Used for internal       │
    │     communication only)     │
    └────────┬────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 2. SELECT DEPARTMENT         │
    │ (47 available options)       │
    │  - Road Maintenance          │
    │  - Water Supply              │
    │  - Street Cleaning           │
    │  - ... and more              │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 3. DEFINE WORK AREA          │
    │ (Critical for location       │
    │  matching)                   │
    │                              │
    │  📍 Map Picker OR GPS:       │
    │  • Click on map to set       │
    │    work location             │
    │  • OR click "Use my          │
    │    location" button          │
    │                              │
    │  Stores: LAT/LNG coordinates │
    │  + City name                 │
    │  + Work zones (optional)     │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 4. CONTACT INFORMATION       │
    │ (Public - shown to citizens) │
    │                              │
    │  📞 Contact Phone            │
    │  📧 Contact Email            │
    │                              │
    │  💡 "Same as above?" ✓       │
    │     checkbox to copy from    │
    │     personal phone/email     │
    │                              │
    │  Why separate?               │
    │  - Personal: Private call    │
    │  - Contact: Citizens message │
    │    about complaints assigned │
    │    to this staff member      │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 5. WORK SCHEDULE (Optional)  │
    │  • Shift start time (09:00)  │
    │  • Shift end time (18:00)    │
    │  • "Working today?" toggle   │
    │    (🟢 Yes / 🔴 No)         │
    │                              │
    │  Used for: Availability      │
    │  filtering in assignment     │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ 6. SKILLS & TITLE            │
    │  • Job Title (Engineer)      │
    │  • Skills (e.g., paving,     │
    │    pipes, electrical)        │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ ✅ STAFF ACCOUNT CREATED     │
    │                              │
    │ Stored in DB:                │
    │ Users collection with        │
    │ role: 'staff'                │
    │ + work area coordinates      │
    │ + public contact details     │
    │ + department assignment      │
    └──────────────────────────────┘
```

### 📝 **Part 2: Citizen Complaint Filing Flow**

```
┌──────────────────────────────────────────────────────┐
│ Citizen Files a Complaint                            │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ 1. ENTER COMPLAINT DETAILS       │
    │  • Title                         │
    │  • Description                   │
    │  • Category (22 options)         │
    │    - Road Damage                 │
    │    - Water Leakage               │
    │    - Garbage Not Collected       │
    │    - ... etc                     │
    │  • Priority (LOW/MEDIUM/HIGH)    │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ 2. PINPOINT LOCATION             │
    │ (3 ways to set it)               │
    │                                  │
    │  A) 📍 Use My Current Location   │
    │     • Click button               │
    │     • Browser requests permission│
    │     • Gets GPS coordinates       │
    │     • Auto-fills lat/lng         │
    │                                  │
    │  B) 🗺️ Click on Map              │
    │     • Interactive map            │
    │     • Click exact location       │
    │     • Updates lat/lng            │
    │                                  │
    │  C) ⌨️ Manual Entry              │
    │     • Type latitude              │
    │     • Type longitude             │
    │                                  │
    │  Validation:                     │
    │  ✓ Location MUST be provided     │
    │  ✓ Valid coordinates checked     │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ 3. AUTO-SELECT DEPARTMENT        │
    │                                  │
    │  System Logic:                   │
    │  • Look up which department      │
    │    handles this category         │
    │  • Auto-assign if only 1 match   │
    │  • Show dropdown if multiple     │
    │                                  │
    │  Example:                        │
    │  Category: "Road Damage"         │
    │    ↓                             │
    │  Departments that handle it:     │
    │  - Road Maintenance              │
    │  - Sidewalk & Footpath           │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ 4. 🎯 LOCATION-BASED STAFF MATCH │
    │                                  │
    │  HAVERSINE DISTANCE CALCULATION  │
    │                                  │
    │  Backend Query:                  │
    │  Find all STAFF where:           │
    │  ✓ Department matches            │
    │  ✓ "Working today?" = YES        │
    │  ✓ Has work area coordinates     │
    │                                  │
    │  For Each Staff:                 │
    │  • Calculate distance from       │
    │    complaint location to         │
    │    staff work area               │
    │  • Use Haversine formula         │
    │  • Distance in KM                │
    │                                  │
    │  Filter by Radius:               │
    │  ✓ Default: 15 km radius         │
    │  ✓ Only show staff within 15 km  │
    │                                  │
    │  Sort Results:                   │
    │  1️⃣ By RATING (highest first)   │
    │  2️⃣ By DISTANCE (closest first)  │
    │                                  │
    │  Calculate ETA:                  │
    │  • ~2 minutes per km             │
    │  • 5 km away → ~10 min ETA       │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌─────────────────────────────────────┐
    │ ⚠️ SCENARIO HANDLING                 │
    │                                     │
    │ Case 1: STAFF FOUND ✅              │
    │  └─ Show list sorted by:            │
    │     • Rating (⭐ 4.8 vs ⭐ 3.5)      │
    │     • Distance (2 km vs 12 km)      │
    │     • Estimated arrival time        │
    │     • Skills & contact phone        │
    │     • "Select" button to assign     │
    │                                     │
    │ Case 2: NO STAFF NEARBY ❌          │
    │  └─ Message shows:                  │
    │     "No staff available in this     │
    │      area within 15 km"             │
    │     • But complaint STILL CREATED   │
    │     • Auto-assigned to department   │
    │     • Marked for admin review       │
    │     • Can manually assign later     │
    │                                     │
    │ Case 3: STAFF FAR AWAY 🚗           │
    │  └─ System STILL shows them!        │
    │     • Distance clearly displayed    │
    │     • "15 km away" / "25 min ETA"   │
    │     • User can still select them    │
    │     • Citizen gets realistic        │
    │       expectation of wait time      │
    └─────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ 5. (OPTIONAL) PROVIDE CONTACT     │
    │    INFORMATION                   │
    │                                  │
    │  • Your Name                     │
    │  • Your Phone 📞                 │
    │    (Validated with              │
    │     libphonenumber-js)           │
    │  • Your Email 📧                 │
    │                                  │
    │  Why?                            │
    │  Staff can call if they need     │
    │  clarification or updates        │
    │                                  │
    │  Security: All optional, stored  │
    │  as "reporterSnapshot" in DB     │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ 6. ✅ COMPLAINT CREATED           │
    │                                  │
    │ Stored in DB (Complaints):       │
    │ • Title, Description, Category   │
    │ • Location: LAT/LNG coordinates  │
    │ • Status: "OPEN"                 │
    │ • SLA Deadline (based on dept)   │
    │ • Department assigned            │
    │ • Staff assigned (if selected)   │
    │ • Reporter info (if provided)    │
    │ • Created timestamp              │
    │ • Status history: [OPEN event]   │
    └──────────────────────────────────┘
```

### 🎯 **Part 3: Staff Availability & Distance Logic**

```
IMPORTANT: NO STAFF IN LOCALITY SCENARIO

Situation:
┌─────────────────────────────────────┐
│  Citizen files complaint in          │
│  REMOTE AREA with no staff nearby    │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    Within 15km   Beyond 15km
        Found       Found
       (YES) ✓       (NO) ✗
         │           │
         │           ▼
         │      ┌──────────────────┐
         │      │ DEFAULT BEHAVIOR │
         │      │                  │
         │      │ ❌ NOT shown to  │
         │      │    citizen in UI │
         │      │                  │
         │      │ ✓ But could be   │
         │      │   assigned by    │
         │      │   admin manually  │
         │      └──────────────────┘
         │
         ▼
    ┌────────────────────────┐
    │ CURRENT IMPLEMENTATION │
    │                        │
    │ Show available staff:  │
    │ • Within 15 km radius  │
    │ • Working today: YES   │
    │ • Same department      │
    │                        │
    │ Display for each:      │
    │ • Name                 │
    │ • Rating ⭐            │
    │ • Distance (km)        │
    │ • ETA (minutes)        │
    │ • Skills               │
    │ • Contact phone        │
    └────────────────────────┘

LIMITATION & IMPROVEMENT NEEDED:

Current: Staff beyond 15km NOT shown
         to citizen

Recommended Enhancement:
┌──────────────────────────────────┐
│ 🚀 SHOW ALL STAFF but with INFO  │
│                                  │
│ Add Toggle: "Show all staff?"     │
│                                  │
│ If NO staff within 15 km:         │
│ Show message:                     │
│ ⚠️ "No staff within 15 km"        │
│                                  │
│ Expand section:                   │
│ "Far-away staff available (50+ km)│
│  Response time: 1-2 hours"        │
│                                  │
│ Benefits:                         │
│ • Transparent about availability  │
│ • Citizen can still get help      │
│ • Sets realistic expectations     │
│ • Better than "no option"         │
│ • Shows accountability            │
└──────────────────────────────────┘
```

### 🔧 **Technical Details: Haversine Distance Calculation**

```javascript
// Server: staffController.js
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    
    // Convert degrees to radians
    const dLat = (lat2 - lat1) * π / 180;
    const dLon = (lon2 - lon1) * π / 180;
    
    // Haversine formula
    const a = sin²(dLat/2) + 
              cos(lat1) * cos(lat2) * sin²(dLon/2);
    
    const c = 2 * atan2(√a, √(1-a));
    
    return R * c; // Distance in kilometers
}

Example:
─────────────────────────────────────
Staff Work Location:   (28.6100, 77.1950)  [Delhi]
Complaint Location:    (28.6500, 77.2500)  [Delhi, 5km away]
─────────────────────────────────────
Distance = ~5.2 km

API Response:
{
  "staff": [
    {
      "name": "Rohan Roads",
      "rating": 4.8,
      "distance": 5.2,          ← 5.2 km away
      "estimatedArrival": 10,   ← ~10 minutes
      "title": "Field Engineer",
      "contactPhone": "+91-98765-43210"
    }
  ],
  "totalFound": 1,
  "searchRadius": 15
}
```

### 📊 **Database Records Created During Flow**

```
User (Staff Registration)
{
  _id: ObjectId,
  role: 'staff',
  name: 'Rohan Roads',
  email: 'rohan@example.com',
  staff: {
    departmentId: ObjectId('dept-road-id'),
    title: 'Field Engineer',
    isWorkingToday: true,
    workArea: {
      location: { lat: 28.6100, lng: 77.1950 }  ← TRACKED!
    },
    contactPhone: '+91-9876543210'              ← PUBLIC
  },
  profile: {
    phone: '+91-9876543210'                     ← PRIVATE
  }
}

Complaint (Citizen Filing)
{
  _id: ObjectId,
  title: 'Road has big pothole',
  category: 'Potholes',
  location: { lat: 28.6500, lng: 77.2500 },  ← COMPLAINT LOCATION!
  createdBy: ObjectId('citizen-id'),
  assignedDepartmentId: ObjectId('dept-road-id'),
  assignedTo: ObjectId('rohan-id'),           ← If selected
  reporterSnapshot: {
    name: 'Arun Kumar',
    phone: '+91-7777777777',
    email: 'arun@example.com'
  },
  status: 'OPEN',
  slaDeadline: Date (72 hours from now),
  statusHistory: [
    { 
      from: null,
      to: 'OPEN',
      note: 'Complaint created',
      at: Date.now()
    }
  ]
}
```

---
