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
+-----------------------------+
| Frontend (React) |
| - Citizen Portal |
| - Staff/Admin Dashboard |
| - Map Visualization (Leaflet) |
+-------------+---------------+
|
↓
+-------------+---------------+
| Backend (Node.js + Express) |
| - RESTful APIs for Auth, Complaints, Reports |
| - JWT Authentication Middleware |
| - SLA Tracking & Escalation Jobs (Cron) |
+-------------+---------------+
|
↓
+-------------+---------------+
| MongoDB Database |
| - Users Collection |
| - Complaints Collection |
| - Notifications Collection |
+-----------------------------+

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
