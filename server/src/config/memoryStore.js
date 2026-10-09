/**
 * In-Memory Demo Data Store for SwasthSetu
 * Provides instantaneous, zero-latency fallback data store when local MongoDB service is offline,
 * ensuring 100% reliable hackathon presentation without setup friction.
 */

class MemoryDataStore {
  constructor() {
    this.users = [];
    this.facilities = [];
    this.patients = [];
    this.appointments = [];
    this.encounters = [];
    this.triageRecords = [];
    this.referrals = [];
    this.inventory = [];
    this.followUps = [];
    this.emergencies = [];
    this.auditLogs = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // 1. Facilities
    this.facilities = [
      {
        _id: 'fac-001',
        name: 'District Hospital Sitapur',
        code: 'DH-STP-01',
        type: 'District Hospital',
        district: 'Sitapur',
        block: 'Sitapur Sadar',
        address: 'Civil Lines, Near Collectorate, Sitapur, Uttar Pradesh',
        phone: '+91-5862-245100',
        location: { lat: 27.5684, lng: 80.6829 },
        departments: ['General Medicine', 'Obstetrics & Gynaecology', 'Pediatrics', 'General Surgery', 'Cardiology', 'Orthopedics', 'Emergency & Trauma'],
        services: ['24x7 Emergency', 'ICU', 'Blood Bank', 'Major Surgery', 'Ultrasound', 'Digital X-Ray', 'Pathology Lab'],
        isActive: true,
      },
      {
        _id: 'fac-002',
        name: 'Community Health Centre (CHC) Laharpur',
        code: 'CHC-LHP-02',
        type: 'CHC',
        district: 'Sitapur',
        block: 'Laharpur',
        address: 'Biswan Road, Laharpur, Sitapur, Uttar Pradesh',
        phone: '+91-5862-254210',
        location: { lat: 27.7142, lng: 80.9023 },
        departments: ['General Medicine', 'Obstetrics & Gynaecology', 'Pediatrics', 'Minor Surgery'],
        services: ['Inpatient 30 Beds', 'Normal Delivery', 'Basic Emergency', 'X-Ray', 'Laboratory', 'Ambulance Support'],
        isActive: true,
      },
      {
        _id: 'fac-003',
        name: 'Community Health Centre (CHC) Mahmudabad',
        code: 'CHC-MMB-03',
        type: 'CHC',
        district: 'Sitapur',
        block: 'Mahmudabad',
        address: 'Station Road, Mahmudabad, Sitapur, Uttar Pradesh',
        phone: '+91-5862-261320',
        location: { lat: 27.2965, lng: 81.1189 },
        departments: ['General Medicine', 'Obstetrics & Gynaecology', 'Pediatrics'],
        services: ['Inpatient 30 Beds', 'Maternal Care', 'Dental Care', 'Diagnostic Lab'],
        isActive: true,
      },
      {
        _id: 'fac-004',
        name: 'Primary Health Centre (PHC) Khairabad',
        code: 'PHC-KHR-04',
        type: 'PHC',
        district: 'Sitapur',
        block: 'Khairabad',
        address: 'Main Bazar, Khairabad, Sitapur, Uttar Pradesh',
        phone: '+91-5862-273105',
        location: { lat: 27.5347, lng: 80.7578 },
        departments: ['General Medicine', 'Maternal & Child Health'],
        services: ['OPD Consultations', 'Immunization', 'Family Planning', 'Basic Pharmacy', 'Antenatal Checkups'],
        isActive: true,
      },
      {
        _id: 'fac-005',
        name: 'Health Sub-Centre Rampur Kalan',
        code: 'SC-RMP-05',
        type: 'Sub-Centre',
        district: 'Sitapur',
        block: 'Khairabad',
        address: 'Panchayat Bhavan Campus, Rampur Kalan Village, Sitapur',
        phone: '+91-9876543207',
        location: { lat: 27.5120, lng: 80.7210 },
        departments: ['Primary Health Care'],
        services: ['ASHA / ANM Base', 'First Aid', 'Immunization Days', 'Maternal Screening', 'Medicine Dispensing'],
        isActive: true,
      },
      {
        _id: 'fac-006',
        name: 'Health Sub-Centre Belahara',
        code: 'SC-BLH-06',
        type: 'Sub-Centre',
        district: 'Sitapur',
        block: 'Laharpur',
        address: 'Near Primary School, Belahara Village, Sitapur',
        phone: '+91-9876543208',
        location: { lat: 27.6950, lng: 80.8710 },
        departments: ['Primary Health Care'],
        services: ['ANM Health Post', 'Antenatal Tracking', 'Fever Screening'],
        isActive: true,
      },
      {
        _id: 'fac-007',
        name: 'Rural Hospital Misrikh',
        code: 'RH-MSR-07',
        type: 'Rural Hospital',
        district: 'Sitapur',
        block: 'Misrikh',
        address: 'Tirth Road, Misrikh, Sitapur, Uttar Pradesh',
        phone: '+91-5862-234560',
        location: { lat: 27.4320, lng: 80.5210 },
        departments: ['General Medicine', 'Pediatrics', 'Gynecology'],
        services: ['Inpatient 20 Beds', 'Digital X-Ray', 'Minor OT', 'Maternity Care'],
        isActive: true,
      },
    ];

    // 2. Users (5 Roles)
    this.users = [
      {
        _id: 'usr-patient-1',
        name: 'Rameshwar Yadav',
        phone: '9876543210',
        role: 'patient',
        facilityId: this.facilities[3], // PHC Khairabad
        language: 'hi',
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr-hw-1',
        name: 'Sunita Devi (ASHA)',
        phone: '9876543211',
        role: 'health_worker',
        facilityId: this.facilities[4], // Sub-Centre Rampur Kalan
        language: 'hi',
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr-doc-1',
        name: 'Dr. Alok Verma',
        phone: '9876543212',
        role: 'doctor',
        facilityId: this.facilities[3], // PHC Khairabad
        department: 'General Medicine',
        registrationNumber: 'MCI-UP-48201',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr-fa-1',
        name: 'Rajendra Kumar (Admin)',
        phone: '9876543213',
        role: 'facility_admin',
        facilityId: this.facilities[1], // CHC Laharpur
        language: 'en',
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr-da-1',
        name: 'Dr. S. K. Awasthi (CMO)',
        phone: '9876543214',
        role: 'district_admin',
        facilityId: this.facilities[0], // District Hospital Sitapur
        department: 'District Health Administration',
        language: 'en',
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // 3. Patients (Demo community profiles)
    this.patients = [
      {
        _id: 'pat-10001',
        patientId: 'P-10001',
        userId: 'usr-patient-1',
        name: 'Rameshwar Yadav',
        age: 54,
        gender: 'Male',
        phone: '9876543210',
        village: 'Rampur Kalan',
        district: 'Sitapur',
        address: 'House 42, Purwa Ward, Rampur Kalan, Sitapur',
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        allergies: ['Penicillin'],
        pregnancy: { isPregnant: false },
        emergencyContact: { name: 'Brijesh Yadav', phone: '9876543299', relation: 'Son' },
        riskLevel: 'YELLOW',
        demoAbhaId: 'ABHA-DEMO-9821-4432',
        consentForSharing: true,
        registeredBy: this.users[1],
        registeredAtFacility: this.facilities[4],
        createdAt: new Date(Date.now() - 86400000 * 3),
        updatedAt: new Date(),
      },
      {
        _id: 'pat-10002',
        patientId: 'P-10002',
        name: 'Kavita Yadav',
        age: 26,
        gender: 'Female',
        phone: '9876543250',
        village: 'Belahara',
        district: 'Sitapur',
        address: 'Near Shiva Temple, Belahara, Sitapur',
        conditions: ['Gestational Hypertension', 'Mild Anemia'],
        allergies: ['Sulfa drugs'],
        pregnancy: { isPregnant: true, trimester: 3, dueDate: new Date('2026-11-20') },
        emergencyContact: { name: 'Manoj Yadav', phone: '9876543251', relation: 'Husband' },
        riskLevel: 'RED',
        demoAbhaId: 'ABHA-DEMO-7712-3301',
        consentForSharing: true,
        registeredBy: this.users[1],
        registeredAtFacility: this.facilities[1],
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(),
      },
      {
        _id: 'pat-10003',
        patientId: 'P-10003',
        name: 'Ramphal Maurya',
        age: 68,
        gender: 'Male',
        phone: '9876543252',
        village: 'Rampur Kalan',
        district: 'Sitapur',
        address: 'Basti Colony, Rampur Kalan, Sitapur',
        conditions: ['Chronic Bronchitis / COPD', 'Smoker'],
        allergies: [],
        pregnancy: { isPregnant: false },
        emergencyContact: { name: 'Suraj Maurya', phone: '9876543253', relation: 'Son' },
        riskLevel: 'RED',
        demoAbhaId: 'ABHA-DEMO-6619-8802',
        consentForSharing: true,
        registeredBy: this.users[1],
        registeredAtFacility: this.facilities[3],
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(),
      },
      {
        _id: 'pat-10004',
        patientId: 'P-10004',
        name: 'Meena Kumari',
        age: 32,
        gender: 'Female',
        phone: '9876543254',
        village: 'Belahara',
        district: 'Sitapur',
        address: 'Ward 3, Belahara, Sitapur',
        conditions: ['Iron Deficiency Anemia'],
        allergies: [],
        pregnancy: { isPregnant: true, trimester: 2, dueDate: new Date('2027-01-10') },
        emergencyContact: { name: 'Dinesh', phone: '9876543255', relation: 'Husband' },
        riskLevel: 'YELLOW',
        demoAbhaId: 'ABHA-DEMO-5521-9988',
        consentForSharing: true,
        registeredBy: this.users[1],
        registeredAtFacility: this.facilities[5],
        createdAt: new Date(Date.now() - 86400000 * 10),
        updatedAt: new Date(),
      },
      {
        _id: 'pat-10005',
        patientId: 'P-10005',
        name: 'Brijesh Pal',
        age: 42,
        gender: 'Male',
        phone: '9876543256',
        village: 'Rampur Kalan',
        district: 'Sitapur',
        address: 'East Tola, Rampur Kalan',
        conditions: [],
        allergies: [],
        pregnancy: { isPregnant: false },
        emergencyContact: { name: 'Suman', phone: '9876543257', relation: 'Wife' },
        riskLevel: 'GREEN',
        demoAbhaId: 'ABHA-DEMO-4433-2211',
        consentForSharing: true,
        registeredBy: this.users[1],
        registeredAtFacility: this.facilities[3],
        createdAt: new Date(Date.now() - 86400000 * 1),
        updatedAt: new Date(),
      },
    ];

    // 4. Appointments & Live Queue
    const todayStr = new Date().toISOString().split('T')[0];
    this.appointments = [
      {
        _id: 'apt-001',
        patientId: this.patients[0],
        doctorId: this.users[2], // Dr. Alok Verma
        facilityId: this.facilities[3], // PHC Khairabad
        department: 'General Medicine',
        appointmentDate: todayStr,
        appointmentTime: '10:30',
        mode: 'In-Person',
        tokenNumber: 1,
        status: 'Waiting',
        reason: 'Hypertension evaluation and routine blood sugar checkup',
        teleRoomId: null,
        createdAt: new Date(),
      },
      {
        _id: 'apt-002',
        patientId: this.patients[1],
        doctorId: this.users[2],
        facilityId: this.facilities[1], // CHC Laharpur
        department: 'Obstetrics & Gynaecology',
        appointmentDate: todayStr,
        appointmentTime: '11:00',
        mode: 'Online',
        tokenNumber: 2,
        status: 'In Progress',
        reason: 'Emergency antenatal teleconsultation for preeclampsia review',
        teleRoomId: 'SwasthSetu-Room-PreeclampsiaReview-2026',
        createdAt: new Date(),
      },
      {
        _id: 'apt-003',
        patientId: this.patients[2],
        doctorId: this.users[2],
        facilityId: this.facilities[3],
        department: 'General Medicine',
        appointmentDate: todayStr,
        appointmentTime: '11:30',
        mode: 'In-Person',
        tokenNumber: 3,
        status: 'Scheduled',
        reason: 'Respiratory distress follow-up',
        teleRoomId: null,
        createdAt: new Date(),
      },
    ];

    // 5. Encounters & Prescriptions
    this.encounters = [
      {
        _id: 'enc-001',
        patientId: this.patients[0],
        doctorId: this.users[2],
        facilityId: this.facilities[3],
        appointmentId: 'apt-001',
        chiefComplaint: 'Headache, neck tension, missed hypertension tablets for 4 days',
        symptoms: ['Headache', 'Dizziness'],
        observations: 'BP: 154/96 mmHg, Pulse: 78 bpm. Bilateral lung fields clear.',
        diagnosis: 'Essential Stage 1 Hypertension with poor medication adherence',
        medicines: [
          { name: 'Amlodipine 5mg', dosage: '5mg', frequency: '1-0-0 (Once daily morning)', duration: '30 Days', instructions: 'After breakfast' },
          { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1 (Twice daily)', duration: '3 Days', instructions: 'SOS for headache' },
          { name: 'Metformin 500mg', dosage: '500mg', frequency: '0-0-1 (Once daily night)', duration: '30 Days', instructions: 'After dinner' },
        ],
        notes: 'Advised strict low salt diet, daily 30 min brisk walk, and no skipping medication.',
        followUpDate: '2026-11-09',
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
    ];

    // 6. Triage Records
    this.triageRecords = [
      {
        _id: 'trg-001',
        patientId: this.patients[0]._id,
        createdBy: this.users[1],
        symptoms: ['Persistent headache', 'Dizziness', 'Mild fatigue'],
        symptomDuration: '3 days',
        vitals: { temperature: 98.6, bpSystolic: 154, bpDiastolic: 96, spo2: 97, bloodSugar: 182, pulse: 78 },
        pregnancyConcern: false,
        additionalObservations: 'Patient has history of hypertension and missed medication for 4 days.',
        ruleLevel: 'YELLOW',
        finalLevel: 'YELLOW',
        triggeredRules: ['Elevated blood pressure: 154/96 mmHg'],
        explanationEnglish: 'Clinical review needed. The assessment identified elevated blood pressure (154/96 mmHg). A healthcare professional should evaluate the patient within 24 hours.',
        explanationHindi: 'चिकित्सीय जांच की आवश्यकता है। मरीज का रक्तचाप 154/96 mmHg बढ़ा हुआ है। अगले 24 घंटों में डॉक्टर से परामर्श अवश्य लें।',
        nextSteps: ['Schedule clinical consultation within the next 4 to 24 hours', 'Monitor blood pressure', 'Review anti-hypertensive medication compliance'],
        requiresHumanReview: true,
        disclaimer: 'Hackathon demonstration decision support only.',
        createdAt: new Date(Date.now() - 3600000 * 5),
      },
      {
        _id: 'trg-002',
        patientId: this.patients[1]._id,
        createdBy: this.users[1],
        symptoms: ['Severe headache', 'Blurred vision', 'Swelling in feet'],
        symptomDuration: '1 day',
        vitals: { temperature: 99.1, bpSystolic: 162, bpDiastolic: 104, spo2: 96, pulse: 92 },
        pregnancyConcern: true,
        additionalObservations: 'Third trimester antenatal patient exhibiting preeclampsia warning signs.',
        ruleLevel: 'RED',
        finalLevel: 'RED',
        triggeredRules: ['Maternal high-risk danger sign: "blurred vision" during pregnancy', 'High BP in pregnancy (Preeclampsia indicator): 162/104 mmHg'],
        explanationEnglish: 'Urgent attention required. The assessment flagged maternal danger signs and high blood pressure during late pregnancy. Immediate specialist obstetrics examination is critical.',
        explanationHindi: 'तत्काल डॉक्टर से परामर्श की आवश्यकता है। गर्भावस्था के अंतिम चरण में उच्च रक्तचाप और धुंधला दिखने के लक्षण गंभीर हैं। तुरंत अस्पताल ले जाएं।',
        nextSteps: ['Immediately alert the duty medical officer / doctor', 'Prepare emergency transfer or ambulance to CHC/District Hospital'],
        requiresHumanReview: true,
        disclaimer: 'Hackathon demonstration decision support only.',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
    ];

    // 7. Referrals
    const overdueDate = new Date(Date.now() - 86400000 * 2);
    const normalDueDate = new Date(Date.now() + 86400000 * 3);

    this.referrals = [
      {
        _id: 'ref-001',
        patientId: this.patients[0],
        fromFacilityId: this.facilities[3], // PHC Khairabad
        toFacilityId: this.facilities[1], // CHC Laharpur
        doctorId: this.users[2],
        department: 'Cardiology',
        reason: 'Uncontrolled blood pressure and suspected hypertensive end-organ changes needing ECG & Specialist review.',
        priority: 'Urgent',
        status: 'Created',
        dueDate: normalDueDate,
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 4),
            facilityId: this.facilities[3],
            updatedBy: this.users[2],
            note: 'Referral generated by PHC Medical Officer following persistent high BP.',
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 4),
        updatedAt: new Date(Date.now() - 3600000 * 4),
      },
      {
        _id: 'ref-002',
        patientId: this.patients[1],
        fromFacilityId: this.facilities[4], // Sub-Centre Rampur
        toFacilityId: this.facilities[1], // CHC Laharpur
        doctorId: this.users[2],
        department: 'Obstetrics & Gynaecology',
        reason: 'Third trimester preeclampsia danger signs needing high-risk delivery planning and ultrasound.',
        priority: 'Emergency',
        status: 'Accepted',
        dueDate: normalDueDate,
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 24),
            facilityId: this.facilities[4],
            updatedBy: this.users[1],
            note: 'Urgent referral initiated by ASHA worker due to elevated BP and blurred vision.',
          },
          {
            status: 'Accepted',
            timestamp: new Date(Date.now() - 3600000 * 18),
            facilityId: this.facilities[1],
            updatedBy: this.users[3],
            note: 'Referral accepted. Inpatient bed and obstetrician on standby at CHC Laharpur.',
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 24),
        updatedAt: new Date(Date.now() - 3600000 * 18),
      },
      {
        _id: 'ref-003',
        patientId: this.patients[2],
        fromFacilityId: this.facilities[3],
        toFacilityId: this.facilities[0], // District Hospital Sitapur
        doctorId: this.users[2],
        department: 'Pulmonology / ICU',
        reason: 'Persistent hypoxemia and COPD exacerbation needing spirometry and oxygen therapy.',
        priority: 'Emergency',
        status: 'Created',
        dueDate: overdueDate,
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 72),
            facilityId: this.facilities[3],
            updatedBy: this.users[2],
            note: 'Awaiting transport and patient confirmation.',
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 72),
        updatedAt: new Date(Date.now() - 3600000 * 72),
      },
    ];

    // 8. Medicine Inventory
    const medNames = [
      { name: 'Paracetamol 500mg', category: 'Analgesics / Antipyretic', unit: 'Tablets' },
      { name: 'Oral Rehydration Salts (ORS)', category: 'Electrolytes', unit: 'Sachets' },
      { name: 'Iron & Folic Acid (IFA)', category: 'Maternal Health', unit: 'Tablets' },
      { name: 'Amlodipine 5mg', category: 'Antihypertensive', unit: 'Tablets' },
      { name: 'Metformin 500mg', category: 'Antidiabetic', unit: 'Tablets' },
      { name: 'Amoxicillin 500mg', category: 'Antibiotics', unit: 'Capsules' },
      { name: 'Cetirizine 10mg', category: 'Antihistamine', unit: 'Tablets' },
      { name: 'Azithromycin 500mg', category: 'Antibiotics', unit: 'Tablets' },
    ];

    this.inventory = [];
    this.facilities.forEach((fac, facIdx) => {
      medNames.forEach((med, medIdx) => {
        let quantity = 150 + (facIdx * 20 + medIdx * 15);
        let reorderLevel = 30;
        if (facIdx === 1 && medIdx === 3) quantity = 12; // CHC Laharpur low stock Amlodipine
        if (facIdx === 3 && medIdx === 2) quantity = 18; // PHC Khairabad low stock IFA
        if (facIdx === 4 && medIdx === 5) quantity = 0; // Sub-Centre Rampur out of stock Amoxicillin

        this.inventory.push({
          _id: `inv-${fac._id}-${medIdx}`,
          facilityId: fac,
          medicineName: med.name,
          category: med.category,
          quantity,
          reorderLevel,
          unit: med.unit,
          batchNumber: `BAT-2026-${100 + medIdx}`,
          expiryDate: '2027-12-31',
          updatedAt: new Date(),
        });
      });
    });

    // 9. Follow-Ups
    this.followUps = [
      {
        _id: 'flw-001',
        patientId: this.patients[0],
        assignedWorkerId: this.users[1],
        program: 'Chronic Disease',
        dueDate: todayStr,
        status: 'Pending',
        notes: 'Check blood pressure and verify daily morning adherence to Amlodipine 5mg.',
        createdAt: new Date(),
      },
      {
        _id: 'flw-002',
        patientId: this.patients[1],
        assignedWorkerId: this.users[1],
        program: 'Maternal',
        dueDate: todayStr,
        status: 'Flagged for Doctor',
        notes: 'High BP observed during home visit. Escort to CHC Laharpur for obstetrician checkup.',
        observations: 'Mild pedal edema noted; BP 160/100 mmHg.',
        createdAt: new Date(),
      },
      {
        _id: 'flw-003',
        patientId: this.patients[3],
        assignedWorkerId: this.users[1],
        program: 'Maternal',
        dueDate: '2026-10-18',
        status: 'Pending',
        notes: 'Second trimester ANC checkup and distribute Iron-Folic Acid tablets.',
        createdAt: new Date(),
      },
    ];

    // 10. Emergencies
    this.emergencies = [
      {
        _id: 'emg-001',
        patientId: this.patients[2],
        reporterName: 'Sunita Devi (ASHA)',
        reporterPhone: '9876543211',
        location: {
          lat: 27.5120,
          lng: 80.7210,
          address: 'Near Panchayat Bhavan, Rampur Kalan Village',
          village: 'Rampur Kalan',
          district: 'Sitapur',
        },
        assignedFacilityId: this.facilities[1], // CHC Laharpur
        severity: 'CRITICAL',
        status: 'Acknowledged',
        notes: 'Demonstration SOS alert: Patient Ramphal Maurya experiencing acute breathing distress. Oxygen support requested.',
        timeline: [
          {
            status: 'Alert Created',
            timestamp: new Date(Date.now() - 1800000),
            updatedBy: this.users[1],
            note: 'SOS triggered by ASHA worker via mobile app',
          },
          {
            status: 'Acknowledged',
            timestamp: new Date(Date.now() - 900000),
            updatedBy: this.users[3],
            note: 'Ambulance team alerted; CHC triage bed prepared',
          },
        ],
        createdAt: new Date(Date.now() - 1800000),
      },
    ];

    this.initialized = true;
    console.log('[MemoryStore] In-memory demonstration healthcare data initialized successfully.');
  }
}

export const memoryStore = new MemoryDataStore();
memoryStore.init();

