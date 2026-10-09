# 📡 SwasthSetu: API Contract & Endpoint Reference

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

### POST `/api/auth/send-otp`
Requests an OTP for phone-based login.
- **Request Body**:
  ```json
  { "phone": "9876543212" }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Demo OTP sent successfully (Use 123456)",
    "demoOtp": "123456"
  }
  ```

### POST `/api/auth/login`
Validates OTP and issues a JWT token.
- **Request Body**:
  ```json
  { "phone": "9876543212", "otp": "123456" }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "_id": "usr-003",
        "name": "Dr. Rajesh Verma",
        "phone": "9876543212",
        "role": "doctor"
      }
    }
  }
  ```

---

## 2. Clinical Triage (`/api/triage`)

### POST `/api/triage/evaluate` *(Requires Auth)*
Evaluates patient vitals using the deterministic rule engine.
- **Request Body**:
  ```json
  {
    "patientId": "pat-10001",
    "vitals": {
      "heartRate": 135,
      "oxygenLevel": 88,
      "systolicBP": 185,
      "diastolicBP": 110,
      "temperature": 102.5
    },
    "symptoms": ["Chest Pain", "Shortness of Breath"]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "ruleLevel": "RED",
      "finalLevel": "RED",
      "explanationEnglish": "Critical respiratory/cardiac distress detected. SpO2 < 90%. Immediate referral required.",
      "explanationHindi": "गंभीर आपातकालीन स्थिति। ऑक्सीजन का स्तर 90% से कम है। तत्काल अस्पताल भेजें।"
    }
  }
  ```

---

## 3. Appointments & OPD Queue (`/api/appointments`)

### GET `/api/appointments` *(Requires Auth)*
Retrieves appointments filtered by doctor, facility, or date.
- **Query Params**: `doctorId`, `facilityId`, `date`, `status`

### PATCH `/api/appointments/:id/status` *(Requires Auth)*
Updates live queue status (e.g. `Waiting`, `In Progress`, `Completed`).

---

## 4. Telehealth & Prescriptions (`/api/tele`)

### POST `/api/tele/:id/prescription` *(Requires Auth)*
Completes appointment and issues prescription.
- **Request Body**:
  ```json
  {
    "diagnosis": "Acute Bronchitis with Hypertensive Crisis",
    "medicines": [
      {
        "name": "Amoxicillin 500mg",
        "dosage": "500mg",
        "frequency": "1-0-1",
        "duration": "5 Days",
        "instructions": "After meals"
      }
    ],
    "notes": "Monitor BP daily. Revisit in 5 days.",
    "followUpDate": "2026-10-15"
  }
  ```

### GET `/api/tele/prescription/:encounterId/pdf` *(Public / Download)*
Streams the generated binary PDF prescription built with PDFKit.

---

## 5. Medicine Availability Locator (`/api/medicines`)

### GET `/api/medicines/search` *(Requires Auth)*
- **Query Params**: `q=Paracetamol&lat=27.5684&lng=80.6829&district=Sitapur`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "inventoryId": "inv-001",
        "medicineName": "Paracetamol 500mg",
        "quantity": 350,
        "facility": {
          "name": "Primary Health Centre Rampur Kalan",
          "type": "PHC",
          "location": { "lat": 27.5712, "lng": 80.6781 }
        },
        "distanceKm": 1.2
      }
    ]
  }
  ```

---

## 6. Emergency Dispatch (`/api/emergency`)

### POST `/api/emergency/sos`
Dispatches an emergency alert.
- **Request Body**:
  ```json
  {
    "reporterName": "Ramesh Patel",
    "reporterPhone": "9876543210",
    "address": "Near Rampur Village Well",
    "notes": "Patient collapsed with breathing difficulty"
  }
  ```

---

## 7. Interoperability & HL7 FHIR R4 (`/fhir/Patient/:id`)

### GET `/fhir/Patient/:id` *(Requires Auth)*
Returns an ABDM-compliant HL7 FHIR R4 Patient JSON object.

