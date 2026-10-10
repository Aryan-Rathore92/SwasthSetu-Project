# SwasthSetu (स्वास्थ्य सेतु) 🏥🇮🇳
### Digital Healthcare Coordination Platform for Rural & Underserved Communities in India

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Stack](https://img.shields.io/badge/Tech%20Stack-MERN%20%2B%20WebRTC%20%2B%20FHIR-blue)](https://github.com)
[![Status](https://img.shields.io/badge/Hackathon-Ready-orange)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **Important Hackathon Disclaimer**: *SwasthSetu is a functional demonstration platform developed for a 24-Hour National Hackathon. It is NOT a certified medical device, does not replace licensed doctors or national emergency dispatch lines (108/102), and is intended strictly to showcase public health digitisation architecture.*

---

## 🌟 Executive Summary

In rural India, patients face immense friction moving between public healthcare tiers:
**Sub-Centres ➡️ Primary Health Centres (PHCs) ➡️ Community Health Centres (CHCs) ➡️ District Hospitals.**

Their health records rarely move with them, causing repeated clinical assessments, lost longitudinal histories, delayed emergency referrals, and hours of unnecessary travel over poor roads.

**SwasthSetu** acts as an integrated digital coordination bridge (*Setu*) connecting **Patients**, **Frontline Health Workers (ASHA/ANM)**, **Medical Officers (Doctors)**, **Facility Administrators**, and **District Health Authorities (CMO)** into a unified real-time ecosystem.

---

## 🏗️ Architecture & Ecosystem

```mermaid
flowchart TD
    subgraph Frontline ["Frontline Village Tier"]
        P[Rural Patient] <-->|Assisted by| HW[ASHA / ANM Worker]
        HW -->|Mobile Registration & Triage| SE[SwasthSetu Gateway]
    end

    subgraph Facility ["Primary & Secondary Health Facilities"]
        SE <-->|OPD Queue & Teleconsult| DOC[Medical Officer / Doctor]
        SE <-->|Beds, Stock, Transfer In/Out| FA[Facility Admin (PHC / CHC)]
    end

    subgraph District ["Governance & Oversight"]
        SE <-->|Aggregated Health Metrics & FHIR Export| DA[District Admin (CMO)]
    end

    subgraph CoreEngine ["Platform Core Engine"]
        TE[Deterministic Rule-Based Triage Engine]
        PDF[PDFKit Prescription Engine]
        WS[Socket.io Real-Time Telemetry]
        GEO[Haversine Pharmacy Locator & Leaflet Map]
        FHIR[HL7 FHIR R4 Interoperability]
    end

    SE --- CoreEngine
```

---

## 🚀 Key Functional Capabilities

1. **Role-Based Access Control (5 Distinct Portals)**:
   - **Rural Patient**: Profile, medical records, digital appointments, verified e-prescriptions, and geospatial medicine locator.
   - **Health Worker (ASHA / ANM)**: Patient registration, community directory, vital assessments, and overdue home visit follow-ups.
   - **Doctor / Medical Officer**: Live OPD queue token caller, WebRTC teleconsultation via Jitsi Meet, clinical Rx pad builder, and inter-facility referral authorizer.
   - **Facility Admin**: OPD appointments management, real-time medicine inventory auditing with low-stock warnings, and referral transfer milestones.
   - **District Health Admin (CMO)**: District-wide health analytics with Recharts, facility density monitoring, and ABDM-aligned HL7 FHIR R4 JSON exports.

2. **Deterministic Triage Safety Engine**:
   - Evaluates vital signs (HR, SpO2, Systolic/Diastolic BP, Temp, Blood Sugar) and red-flag symptoms.
   - Generates non-negotiable **RED / YELLOW / GREEN** urgency categories with human-in-the-loop requirements.
   - Provides bilingual clinical explanations in **English and Hindi (हिन्दी)**.

3. **Virtual Teleconsultation**:
   - Integrated zero-friction WebRTC video consultation suite powered by Jitsi Meet.
   - Allows remote doctors to examine village patients over low-bandwidth connections.

4. **Printable PDF Prescription Pad**:
   - Generates official, downloadable doctor prescriptions using **PDFKit** featuring clinical observations, drug dosages, instructions, doctor MCI registration, and demonstration watermark.

5. **Geospatial Medicine Inventory Tracker**:
   - Real-time stock audit search with distance calculation via the Haversine formula.
   - Interactive Leaflet OpenStreetMap displaying nearby PHCs and CHCs with stock quantities.

6. **Instant Emergency SOS Telemetry**:
   - Dispatches emergency alerts with location details to nearby health facilities and the district command room via **Socket.io**.

7. **Dual-Mode Resilient Database**:
   - Zero-configuration automatic fallback: works seamlessly either with **MongoDB** or via an internal, pre-seeded **In-Memory Demonstration Repository** (45 rural patients, 11 facilities across all tiers, 5 role accounts, inventory, appointments, referrals).

---

## 🔑 1-Click Demo Accounts

| Role | Name | Phone Number | Demo OTP | Direct Portal Route |
| :--- | :--- | :--- | :--- | :--- |
| **Frontline Worker (ASHA)** | Sunita Sharma | `9876543211` | `123456` | `/healthworker/dashboard` |
| **Medical Officer (Doctor)** | Dr. Rajesh Verma | `9876543212` | `123456` | `/doctor/dashboard` |
| **Rural Patient** | Ramesh Patel | `9876543210` | `123456` | `/patient/dashboard` |
| **Facility Admin (CHC)** | Amit Singh | `9876543213` | `123456` | `/facility/dashboard` |
| **District Admin (CMO)** | Dr. Sunita Rao | `9876543214` | `123456` | `/district/dashboard` |

> *Tip: On the `/login` page, you can click on any role button to instantly sign in with one click without manually typing!*

---

## 💻 Quick Start & Installation

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/swasthsetu.git
cd swasthsetu

# Install dependencies for both backend and frontend monorepo workspaces
npm install
```

### 2. Start Full-Stack Application
```bash
npm run dev
```

Run this command from the repository root so both the API and frontend start. Starting only the client workspace will not start the API required for login, session verification, logout, or Socket.IO. The development command stops both processes if either one fails, rather than leaving the frontend running against a missing API.
Each phone number can register one account; registered users can log in repeatedly, and duplicate registration returns a clear prompt to sign in.

This single command concurrently starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

Open `http://localhost:5173` in your browser.
To verify the API is ready, open `http://localhost:5000/api/health`; it should return JSON with `"status":"healthy"`. If that address does not respond, check the backend terminal output and run `npm run dev` from the repository root before retrying authentication.

---

## 🧪 Automated System Testing

Run the full end-to-end integration and system test suite:
```bash
npm run test
```

Verifies:
- Health check & demo configuration
- 5-role JWT authentication, session verification, logout, and Socket.IO availability
- Deterministic clinical triage engine with bilingual explanations
- Geospatial Haversine medicine locator
- Emergency SOS dispatch telemetry
- Authenticated role dashboards
- HL7 FHIR R4 Patient JSON resource generator
- Printable PDFKit prescription download

---

## 📁 Repository Structure

```
Swasthsetu2/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios API client & endpoints
│   │   ├── components/layout/  # Navbar, Footer, DashboardLayout
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── i18n/               # Bilingual EN & HI localization
│   │   ├── pages/
│   │   │   ├── auth/           # 1-Click Login
│   │   │   ├── district/       # CMO Analytics, Facilities, FHIR Reports
│   │   │   ├── doctor/         # Live Queue, Consultation, Telehealth, Referrals
│   │   │   ├── facility/       # Appointments, Inventory, Referral transfers
│   │   │   ├── healthworker/   # Registration, Directory, Triage, Follow-ups
│   │   │   ├── patient/        # Profile, History, Appointments, Medicine Map
│   │   │   └── public/         # Landing, About, Contact
│   │   ├── App.jsx             # React Router DOM configuration
│   │   └── main.jsx            # Application entry point
│   ├── tailwind.config.js      # Healthcare SaaS theme
│   └── vite.config.js          # Vite configuration with proxy
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # DB connection & In-Memory Store fallback
│   │   ├── middleware/         # Auth, Roles, Error Handler
│   │   ├── models/             # Mongoose schemas (11 models)
│   │   ├── modules/            # Domain controllers & services
│   │   │   ├── ai/             # Patient context summarizer
│   │   │   ├── appointment/    # Token queue & bookings
│   │   │   ├── auth/           # OTP authentication & JWT
│   │   │   ├── dashboard/      # Role-specific dashboard aggregations
│   │   │   ├── emergency/      # SOS dispatcher
│   │   │   ├── fhir/           # HL7 FHIR R4 standard compliance
│   │   │   ├── followup/       # Frontline tasks manager
│   │   │   ├── inventory/      # Medicine stock & Haversine search
│   │   │   ├── patient/        # Longitudinal records & timeline
│   │   │   ├── referral/       # Multi-tier referral tracking
│   │   │   ├── tele/           # Video consultation & PDFKit prescriptions
│   │   │   └── triage/         # Deterministic rule-based engine
│   │   ├── sockets/            # Socket.io room broadcasts
│   │   ├── app.js              # Express app
│   │   └── index.js            # Server entry point
│   └── seed/seed.js            # Database seeding utility
│
├── docs/                       # Hackathon & Technical Documentation
│   ├── architecture.md         # Detailed technical architecture
│   ├── api-contract.md         # API endpoints & payloads
│   └── demo-script.md          # 5-Minute Pitch & Presentation Guide
└── package.json                # Monorepo workspaces & scripts
```

---

## 🇮🇳 ABDM & Interoperability Standards
SwasthSetu aligns with India's Ayushman Bharat Digital Mission (ABDM) guidelines:
- **HL7 FHIR R4 compliant**: Standardized `/fhir/Patient/:id` endpoint.
- **ABHA Identifier compatibility**: Demo ABHA IDs pre-configured across rural health records.
- **Audit Trails**: Security compliance logging on critical clinical events.

---

## ⚖️ License
Released under the MIT License. Developed for the 24-Hour National Healthcare Hackathon.

#   S w a s t h S e t u - P r o j e c t  
 