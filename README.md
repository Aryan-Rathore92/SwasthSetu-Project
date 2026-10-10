Live Project : (https://deft-gecko-680942.netlify.app)

# SwasthSetu

**Digital Healthcare Coordination Platform for Rural India**

## 1. Project Overview

* SwasthSetu is a web-based healthcare management platform.
* It connects rural patients, health workers, doctors, hospitals, and district administrators.
* It helps improve healthcare access and coordination in rural areas.
* It provides a common platform for managing patient records, appointments, referrals, medicines, and emergencies.

## 2. Problem Statement

Rural communities face several healthcare challenges:

1. Limited access to specialist doctors.
2. Long travel distances to hospitals.
3. Delays in appointments and treatment.
4. Scattered and unorganised medical records.
5. Poor communication between healthcare facilities.
6. Limited information about medicine availability.
7. Delays in emergency referrals.
8. Lack of proper patient follow-up.

## 3. Proposed Solution

SwasthSetu provides:

1. Centralised digital patient records.
2. Online doctor appointments.
3. Video consultations with doctors.
4. Digital prescriptions.
5. Patient referral tracking.
6. Medicine availability tracking.
7. Emergency SOS alerts.
8. Health worker assistance.
9. Hospital management dashboards.
10. District-level healthcare monitoring.

## 4. User Roles

The platform has five main user roles.

**1. Patient**

* View medical records.
* Book appointments.
* Consult doctors online.
* Access digital prescriptions.
* Find nearby facilities with available medicines.

**2. Health Worker (ASHA/ANM)**

* Register rural patients.
* Record basic health information.
* Assist patients with healthcare services.
* Perform initial health assessments.
* Manage patient follow-ups.

**3. Doctor**

* Manage patient appointments.
* Conduct video consultations.
* View patient medical history.
* Generate digital prescriptions.
* Refer patients to other hospitals.

**4. Facility Admin**

* Manage hospital appointments.
* Track available medicines.
* Monitor medicine stock.
* Manage patient referrals and transfers.

**5. District Admin**

* Monitor healthcare facilities.
* View district-level healthcare data.
* Analyse hospital performance.
* Generate healthcare reports.

## 5. Main Features

**1. Smart Patient Triage**

* Checks basic health information and symptoms.
* Classifies patients into Red, Yellow, and Green priority levels.
* Helps healthcare workers identify urgent cases.
* Supports Hindi and English explanations.

**2. Online Consultation**

* Video consultation between patients and doctors.
* Uses Jitsi Meet and WebRTC.
* Helps reduce unnecessary hospital visits.

**3. Digital Prescription**

* Doctors can generate prescriptions digitally.
* Prescriptions can be downloaded as PDFs.
* Includes medicines, dosage, instructions, and doctor details.

**4. Medicine Availability Tracker**

* Shows medicine stock at healthcare facilities.
* Helps users locate nearby facilities.
* Displays facility locations on an interactive map.

**5. Emergency SOS**

* Sends emergency alerts with location information.
* Notifies nearby healthcare facilities and district authorities.
* Uses Socket.IO for real-time communication.

**6. Referral Management**

* Doctors can refer patients to higher-level hospitals.
* Tracks referrals between healthcare facilities.
* Helps improve coordination during patient transfers.

**7. Digital Health Records**

* Stores patient medical history.
* Maintains consultation and treatment information.
* Helps doctors access previous patient records.

**8. Healthcare Analytics**

* Provides healthcare statistics.
* Helps administrators monitor facilities.
* Supports better healthcare planning and management.

## 6. Technology Stack

**Frontend**

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

**Backend**

* Node.js
* Express.js
* REST APIs

**Database**

* MongoDB
* Mongoose

**Other Technologies**

* Socket.IO – Real-time updates and emergency alerts.
* WebRTC / Jitsi Meet – Video consultations.
* PDFKit – Digital prescription generation.
* Leaflet / OpenStreetMap – Facility location maps.
* Recharts – Data visualisation.
* JWT – Authentication.
* HL7 FHIR R4 – Healthcare data exchange format.

## 7. Authentication

* Role-based login system.
* OTP-based authentication.
* JWT-based sessions.
* Separate dashboard for each user role.
* Demo accounts for testing all five roles.

## 8. Database and Demo Support

* MongoDB is used for storing application data.
* An in-memory database is also available for demonstration.
* The demo includes:

  * 45 patients.
  * 11 healthcare facilities.
  * 5 role-based accounts.
  * Sample appointments.
  * Medicine inventory.
  * Patient referrals.

## 9. Project Setup

**Requirements**

* Node.js version 18 or higher.
* npm version 9 or higher.

**Installation**

1. Open the project folder in VS Code.
2. Open the terminal.
3. Install dependencies using `npm install`.
4. Start the application using `npm run dev`.

**Local URLs**

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`
* Health Check: `http://localhost:5000/api/health`

## 10. Testing

Run `npm run test` to execute automated tests.

Testing covers:

1. Authentication and user roles.
2. API health checks.
3. Patient triage.
4. Medicine location search.
5. Emergency SOS alerts.
6. Role-based dashboards.
7. Healthcare data export.
8. PDF prescription generation.

## 11. Healthcare Standards

* Designed with reference to Ayushman Bharat Digital Mission (ABDM).
* Supports HL7 FHIR R4 healthcare data formats.
* Includes demonstration ABHA identifiers.
* Maintains audit logs for important clinical activities.

## 12. Project Purpose

SwasthSetu aims to:

1. Improve healthcare accessibility in rural India.
2. Reduce unnecessary hospital visits.
3. Improve communication between hospitals.
4. Make patient information easier to access.
5. Support faster referrals and emergency coordination.
6. Help healthcare workers provide better assistance.
7. Improve medicine availability information.
8. Support digital transformation in public healthcare.

**Important Note:** SwasthSetu is a hackathon demonstration project. It is not a certified medical device and does not replace doctors or official emergency services.
