# 🎙️ SwasthSetu: 5-Minute Hackathon Demo Script

This script walks the presenter through a live, end-to-end demonstration of SwasthSetu for hackathon evaluators.

---

## ⏱️ Minute 0:00 - 1:00: Problem Statement & Landing Page
1. **Open Landing Page** (`http://localhost:5173/`):
   - *"Respected judges, healthcare in rural India faces a critical continuity gap. A patient travels from a village Sub-Centre to a PHC and then to a District Hospital, but their health records don't move with them. This causes repetitive tests, delayed treatment, and days of lost wages."*
   - Scroll smoothly down the landing page highlighting the **8 Core Capabilities** and the **5-Step Care Pathway**.
   - Show the language switcher toggle: Click **"हिन्दी"** in the top navigation bar to demonstrate instant bilingual accessibility for rural frontline workers.
   - Click **"Portal Login"**.

---

## ⏱️ Minute 1:00 - 2:00: Frontline Worker (ASHA / ANM) Workflow
1. **Sign in as Frontline Health Worker**:
   - On `/login`, click the **"Health Worker (ASHA)"** demo button. It logs in as *Sunita Sharma* with 1-click.
2. **Clinical Triage Evaluation**:
   - In the sidebar, navigate to **Health Triage** (`/healthworker/triage`).
   - Select patient **Ramesh Patel**.
   - Enter severe vitals to trigger the safety rule engine:
     - Heart Rate: `135 bpm`
     - Oxygen (SpO2): `88%`
     - Blood Pressure: `185/110 mmHg`
     - Symptoms: Check **"Chest Pain / Pressure"** and **"Shortness of breath"**.
   - Click **"Run Clinical Assessment & Triage"**.
   - **Show the result**:
     - Immediate **RED (CRITICAL / IMMEDIATE)** triage badge.
     - Highlight the deterministic safety engine: explain that the platform follows strict medical thresholds and AI cannot downgrade clinical urgency.
     - Show the bilingual explanation generated in both Hindi and English.
3. **Follow-Up Tasks**:
   - Check **Follow-Up Tasks** (`/healthworker/followups`) showing scheduled home visits for high-risk pregnant mothers and hypertensive patients.

---

## ⏱️ Minute 2:00 - 3:00: Doctor / Medical Officer Consultation & Telehealth
1. **Switch to Doctor Role**:
   - Log out, and on `/login`, click **"Doctor / Medical Officer"** (Dr. Rajesh Verma).
2. **Live OPD Queue**:
   - Open **Consultation Queue** (`/doctor/queue`).
   - Notice the live queue with token numbers and triage urgency flags.
   - Click **"Call Next"** or **"Examine & Rx"** for an appointment.
3. **Clinical Prescription Pad**:
   - Open `/doctor/consultation`.
   - Click **"Generate AI Patient Summary"** to demonstrate clinical context synthesis summarizing the patient's longitudinal history in seconds.
   - Add clinical observations, diagnosis, and medications with frequency (e.g., `1-0-1 After food`).
   - Click **"Complete & Issue E-Prescription"**.
   - Click **"Download Official PDF Prescription"** to reveal the printable medical prescription created on-the-fly with **PDFKit**, complete with MCI registration number and demonstration watermark.
4. **Teleconsultation Suite**:
   - Click **Teleconsultation** (`/doctor/tele`) to show the embedded **Jitsi Meet WebRTC room** enabling live video consultations over rural networks.

---

## ⏱️ Minute 3:00 - 4:00: Inter-Facility Referral & Medicine Map
1. **Referral Transfer Manager**:
   - In Doctor or Facility Admin portal, open **Referral Manager** (`/doctor/referrals` or `/facility/referrals`).
   - Show the 4-stage lifecycle: **Created ➡️ Accepted ➡️ Arrived ➡️ Closed**.
   - Demonstrate accepting a pending transfer from PHC to CHC with bed assignment.
2. **Geospatial Medicine Inventory Tracker**:
   - Log into the Patient Portal or search medicines (`/patient/medicines`).
   - Type `"Paracetamol"` or `"Amoxicillin"`.
   - Show the interactive **Leaflet OpenStreetMap** showing exact coordinates of nearby Sub-Centres and PHCs with live available stock counts and Haversine distances.

---

## ⏱️ Minute 4:00 - 5:00: District Administration & HL7 FHIR Interoperability
1. **District Health Admin (CMO)**:
   - On `/login`, click **"District Admin (CMO)"** (Dr. Sunita Rao).
   - View **Health Analytics** (`/district/analytics`):
     - Interactive Recharts visualizing:
       - 7-Day Consultation Volume Trends
       - Multi-tier Referral Progression
       - OPD Appointment Status distribution
       - Facility Workload Comparison across the district.
2. **ABDM HL7 FHIR R4 Standard Compliance**:
   - Open **Reports & FHIR** (`/district/reports`).
   - Type `P-10001` and click **"Export FHIR R4 Patient Resource"**.
   - Show the live generated standard-compliant HL7 FHIR R4 JSON representation, proving alignment with India's Ayushman Bharat Digital Mission (ABDM).
3. **Emergency SOS Telemetry**:
   - Click the red **"Emergency Help (SOS)"** button in the sidebar.
   - Confirm SOS: show the real-time Socket.io dispatch banner alerting facilities.

---

## 🏆 Key Closing Line
*"SwasthSetu does not replace doctors — it bridges the gap between rural patients, frontline workers, and specialist care, ensuring that in public healthcare, no patient is ever left behind."*

