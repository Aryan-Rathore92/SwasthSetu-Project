import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Facility } from '../src/models/Facility.js';
import { Patient } from '../src/models/Patient.js';
import { Appointment } from '../src/models/Appointment.js';
import { Encounter } from '../src/models/Encounter.js';
import { Triage } from '../src/models/Triage.js';
import { Referral } from '../src/models/Referral.js';
import { Inventory } from '../src/models/Inventory.js';
import { FollowUp } from '../src/models/FollowUp.js';
import { Emergency } from '../src/models/Emergency.js';
import { AuditLog } from '../src/models/AuditLog.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Facility.deleteMany({}),
      Patient.deleteMany({}),
      Appointment.deleteMany({}),
      Encounter.deleteMany({}),
      Triage.deleteMany({}),
      Referral.deleteMany({}),
      Inventory.deleteMany({}),
      FollowUp.deleteMany({}),
      Emergency.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    // 1. SEED FACILITIES (11 Realistic Indian Public Healthcare Facilities)
    console.log('[Seed] Creating healthcare facilities across tiers...');
    const facilitiesData = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: 'Primary Health Centre (PHC) Hargaon',
        code: 'PHC-HRG-05',
        type: 'PHC',
        district: 'Sitapur',
        block: 'Hargaon',
        address: 'Sugar Mill Road, Hargaon, Sitapur, Uttar Pradesh',
        phone: '+91-5862-282110',
        location: { lat: 27.7781, lng: 80.7523 },
        departments: ['General Medicine', 'Maternal & Child Health'],
        services: ['OPD Consultations', 'DOTS TB Center', 'Basic Diagnostics', 'Pharmacy'],
      },
      {
        name: 'Primary Health Centre (PHC) Sidhauli',
        code: 'PHC-SDH-06',
        type: 'PHC',
        district: 'Sitapur',
        block: 'Sidhauli',
        address: 'National Highway 24, Sidhauli, Sitapur, Uttar Pradesh',
        phone: '+91-5862-291430',
        location: { lat: 27.2831, lng: 80.8286 },
        departments: ['General Medicine', 'Maternal & Child Health'],
        services: ['OPD Consultations', '24x7 Delivery Point', 'Pharmacy', 'Lab'],
      },
      {
        name: 'Health Sub-Centre Rampur Kalan',
        code: 'SC-RMP-07',
        type: 'Sub-Centre',
        district: 'Sitapur',
        block: 'Khairabad',
        address: 'Panchayat Bhavan Campus, Rampur Kalan Village, Sitapur',
        phone: '+91-9876543207',
        location: { lat: 27.5120, lng: 80.7210 },
        departments: ['Primary Health Care'],
        services: ['ASHA / ANM Base', 'First Aid', 'Immunization Days', 'Maternal Screening', 'Medicine Dispensing'],
      },
      {
        name: 'Health Sub-Centre Belahara',
        code: 'SC-BLH-08',
        type: 'Sub-Centre',
        district: 'Sitapur',
        block: 'Laharpur',
        address: 'Near Primary School, Belahara Village, Sitapur',
        phone: '+91-9876543208',
        location: { lat: 27.6950, lng: 80.8710 },
        departments: ['Primary Health Care'],
        services: ['ANM Health Post', 'Antenatal Tracking', 'Fever Screening'],
      },
      {
        name: 'Health Sub-Centre Keshwapur',
        code: 'SC-KSH-09',
        type: 'Sub-Centre',
        district: 'Sitapur',
        block: 'Hargaon',
        address: 'Gram Sabha Campus, Keshwapur Village, Sitapur',
        phone: '+91-9876543209',
        location: { lat: 27.7610, lng: 80.7390 },
        departments: ['Primary Health Care'],
        services: ['Frontline Maternal Health', 'Routine Vitals Check', 'Child Nutrition Monitoring'],
      },
      {
        name: 'Health Sub-Centre Saraiyan',
        code: 'SC-SRY-10',
        type: 'Sub-Centre',
        district: 'Sitapur',
        block: 'Sidhauli',
        address: 'Village Chowk, Saraiyan, Sitapur',
        phone: '+91-9876543210',
        location: { lat: 27.2650, lng: 80.8420 },
        departments: ['Primary Health Care'],
        services: ['ASHA Support Base', 'Child Health Records', 'Basic Emergency Triage'],
      },
      {
        name: 'Rural Hospital Misrikh',
        code: 'RH-MSR-11',
        type: 'Rural Hospital',
        district: 'Sitapur',
        block: 'Misrikh',
        address: 'Tirth Road, Misrikh, Sitapur, Uttar Pradesh',
        phone: '+91-5862-234560',
        location: { lat: 27.4320, lng: 80.5210 },
        departments: ['General Medicine', 'Pediatrics', 'Gynecology'],
        services: ['Inpatient 20 Beds', 'Digital X-Ray', 'Minor OT', 'Maternity Care'],
      },
    ];

    const facilities = await Facility.insertMany(facilitiesData);
    const dhFacility = facilities[0]; // District Hospital
    const chcLaharpur = facilities[1]; // CHC Laharpur
    const phcKhairabad = facilities[3]; // PHC Khairabad
    const scRampur = facilities[6]; // Sub Centre Rampur Kalan

    // 2. SEED USERS (5 Roles including Demo Test Accounts)
    console.log('[Seed] Creating users across all five roles...');
    const usersData = [
      // 1. Patient Demo User
      {
        name: 'Rameshwar Yadav',
        phone: '9876543210',
        role: 'patient',
        facilityId: phcKhairabad._id,
        language: 'hi',
      },
      // 2. Frontline Health Worker (ASHA) Demo User
      {
        name: 'Sunita Devi (ASHA)',
        phone: '9876543211',
        role: 'health_worker',
        facilityId: scRampur._id,
        language: 'hi',
      },
      // 3. Doctor Demo User (PHC Medical Officer)
      {
        name: 'Dr. Alok Verma',
        phone: '9876543212',
        role: 'doctor',
        facilityId: phcKhairabad._id,
        department: 'General Medicine',
        registrationNumber: 'MCI-UP-48201',
        language: 'en',
      },
      // Additional Doctor at CHC Laharpur
      {
        name: 'Dr. Priya Sharma',
        phone: '9876543220',
        role: 'doctor',
        facilityId: chcLaharpur._id,
        department: 'Obstetrics & Gynaecology',
        registrationNumber: 'MCI-UP-51092',
        language: 'en',
      },
      // Additional Specialist Doctor at District Hospital
      {
        name: 'Dr. Rajesh Khanna',
        phone: '9876543221',
        role: 'doctor',
        facilityId: dhFacility._id,
        department: 'Cardiology',
        registrationNumber: 'MCI-UP-39912',
        language: 'en',
      },
      // 4. Facility Admin Demo User
      {
        name: 'Rajendra Kumar (Admin)',
        phone: '9876543213',
        role: 'facility_admin',
        facilityId: chcLaharpur._id,
        language: 'en',
      },
      // 5. District Chief Medical Officer (District Admin) Demo User
      {
        name: 'Dr. S. K. Awasthi (CMO)',
        phone: '9876543214',
        role: 'district_admin',
        facilityId: dhFacility._id,
        department: 'District Health Administration',
        language: 'en',
      },
    ];

    const users = await User.insertMany(usersData);
    const demoPatientUser = users[0];
    const demoHealthWorker = users[1];
    const demoDoctor = users[2];
    const chcDoctor = users[3];
    const dhDoctor = users[4];

    // 3. SEED PATIENTS (45 Realistic Indian Rural Patients)
    console.log('[Seed] Generating 45 rural community patient profiles...');
    const villages = ['Rampur Kalan', 'Belahara', 'Keshwapur', 'Saraiyan', 'Pipra', 'Gopamau', 'Bhartipur', 'Kareempur', 'Navanagar', 'Jalalpur'];
    const maleNames = ['Rameshwar Yadav', 'Brijesh Pal', 'Ramphal Maurya', 'Suraj Singh', 'Manoj Kumar', 'Ghanshyam Tiwari', 'Dinesh Gautam', 'Kishan Lal', 'Bablu Verma', 'Harish Chandra', 'Santosh Shukla', 'Devendra Pandey', 'Mahesh Rawat', 'Anil Kashyap', 'Suresh Lodhi', 'Pradeep Chauhan', 'Virendra Sonkar', 'Omkar Nishad', 'Jagdish Prasad', 'Vijay Bahadur'];
    const femaleNames = ['Geeta Devi', 'Meena Kumari', 'Kavita Yadav', 'Shanti Devi', 'Parvati Singh', 'Urmila Devi', 'Rani Gupta', 'Kamla Rawat', 'Kusum Maurya', 'Asha Devi', 'Savitri Bai', 'Pinki Verma', 'Pooja Tiwari', 'Rekha Gautam', 'Chanda Devi', 'Anita Devi', 'Manju Nishad', 'Pushpa Kashyap', 'Sarojini Devi', 'Bindu Pal'];

    const patientsToInsert = [
      // Primary demo patient linked to user account
      {
        patientId: 'P-10001',
        userId: demoPatientUser._id,
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
        registeredBy: demoHealthWorker._id,
        registeredAtFacility: scRampur._id,
      },
      // High-Risk Pregnant Patient
      {
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
        registeredBy: demoHealthWorker._id,
        registeredAtFacility: chcLaharpur._id,
      },
      // Elderly Patient with COPD / SpO2 concern
      {
        patientId: 'P-10003',
        name: 'Ramphal Maurya',
        age: 68,
        gender: 'Male',
        phone: '9876543252',
        village: 'Pipra',
        district: 'Sitapur',
        address: 'Basti Colony, Pipra, Sitapur',
        conditions: ['Chronic Bronchitis / COPD', 'Smoker'],
        allergies: [],
        pregnancy: { isPregnant: false },
        emergencyContact: { name: 'Suraj Maurya', phone: '9876543253', relation: 'Son' },
        riskLevel: 'RED',
        demoAbhaId: 'ABHA-DEMO-6619-8802',
        consentForSharing: true,
        registeredBy: demoHealthWorker._id,
        registeredAtFacility: phcKhairabad._id,
      },
    ];

    // Generate remainder up to 45 patients
    for (let i = 4; i <= 45; i++) {
      const isFemale = i % 2 === 0;
      const namePool = isFemale ? femaleNames : maleNames;
      const rawName = namePool[(i - 4) % namePool.length];
      const age = 18 + ((i * 7) % 65);
      const isPregnant = isFemale && age >= 20 && age <= 35 && i % 3 === 0;
      const riskLevel = i % 7 === 0 ? 'RED' : i % 3 === 0 ? 'YELLOW' : 'GREEN';

      patientsToInsert.push({
        patientId: `P-${10000 + i}`,
        name: `${rawName} (${i})`,
        age,
        gender: isFemale ? 'Female' : 'Male',
        phone: `9876543${String(100 + i).slice(-3)}`,
        village: villages[i % villages.length],
        district: 'Sitapur',
        address: `Ward ${1 + (i % 8)}, ${villages[i % villages.length]}`,
        conditions: i % 4 === 0 ? ['Hypertension'] : i % 5 === 0 ? ['Diabetes'] : [],
        allergies: i % 6 === 0 ? ['Dust / Pollen'] : [],
        pregnancy: {
          isPregnant,
          trimester: isPregnant ? 1 + (i % 3) : null,
          dueDate: isPregnant ? new Date('2026-12-15') : null,
        },
        emergencyContact: {
          name: isFemale ? 'Family Member' : 'Spouse',
          phone: `9876543${String(200 + i).slice(-3)}`,
          relation: isFemale ? 'Husband / Father' : 'Wife',
        },
        riskLevel,
        demoAbhaId: `ABHA-DEMO-${1000 + i}-${2000 + i}`,
        consentForSharing: true,
        registeredBy: demoHealthWorker._id,
        registeredAtFacility: facilities[i % facilities.length]._id,
      });
    }

    const patients = await Patient.insertMany(patientsToInsert);
    const p1 = patients[0]; // Rameshwar Yadav
    const p2 = patients[1]; // Kavita Yadav
    const p3 = patients[2]; // Ramphal Maurya

    // 4. SEED MEDICINE INVENTORY ACROSS FACILITIES
    console.log('[Seed] Seeding medicine inventory across healthcare facilities...');
    const medicineCatalog = [
      { name: 'Paracetamol 500mg', category: 'Analgesics / Antipyretic', defaultQty: 450, reorder: 50, unit: 'Tablets' },
      { name: 'Oral Rehydration Salts (ORS)', category: 'Electrolytes', defaultQty: 200, reorder: 40, unit: 'Sachets' },
      { name: 'Iron & Folic Acid (IFA)', category: 'Maternal Health', defaultQty: 300, reorder: 60, unit: 'Tablets' },
      { name: 'Amlodipine 5mg', category: 'Antihypertensive', defaultQty: 180, reorder: 30, unit: 'Tablets' },
      { name: 'Metformin 500mg', category: 'Antidiabetic', defaultQty: 250, reorder: 40, unit: 'Tablets' },
      { name: 'Amoxicillin 500mg', category: 'Antibiotics', defaultQty: 120, reorder: 25, unit: 'Capsules' },
      { name: 'Cetirizine 10mg', category: 'Antihistamine', defaultQty: 160, reorder: 30, unit: 'Tablets' },
      { name: 'Albendazole 400mg', category: 'Antiparasitic', defaultQty: 80, reorder: 20, unit: 'Tablets' },
      { name: 'Azithromycin 500mg', category: 'Antibiotics', defaultQty: 90, reorder: 20, unit: 'Tablets' },
      { name: 'Zinc Sulfate 20mg', category: 'Pediatric Care', defaultQty: 150, reorder: 30, unit: 'Tablets' },
      { name: 'Insulin Glargine 100IU/ml', category: 'Endocrine', defaultQty: 15, reorder: 10, unit: 'Vials' },
      { name: 'Dexamethasone 4mg/ml', category: 'Emergency Steroids', defaultQty: 25, reorder: 10, unit: 'Vials' },
    ];

    const inventoryToInsert = [];
    facilities.forEach((fac, facIdx) => {
      medicineCatalog.forEach((med, medIdx) => {
        // Vary stock to create realistic mix: healthy stock, low stock, out of stock
        let qty = med.defaultQty - ((facIdx * 17 + medIdx * 11) % med.defaultQty);
        if (facIdx === 1 && medIdx === 3) qty = 8; // CHC Laharpur low stock on Amlodipine
        if (facIdx === 3 && medIdx === 2) qty = 12; // PHC Khairabad low stock on IFA
        if (facIdx === 6 && medIdx === 0) qty = 15; // Sub-Centre Rampur Kalan low stock on Paracetamol
        if (facIdx === 6 && medIdx === 5) qty = 0; // Sub-Centre Rampur Kalan out of stock Amoxicillin

        inventoryToInsert.push({
          facilityId: fac._id,
          medicineName: med.name,
          category: med.category,
          quantity: qty,
          reorderLevel: med.reorder,
          unit: med.unit,
          batchNumber: `BAT-2026-${100 + medIdx}`,
          expiryDate: '2027-12-31',
        });
      });
    });

    await Inventory.insertMany(inventoryToInsert);

    // 5. SEED TRIAGE EVALUATIONS
    console.log('[Seed] Seeding triage assessment records...');
    const triageRecords = [
      {
        patientId: p1._id,
        createdBy: demoHealthWorker._id,
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
      },
      {
        patientId: p2._id,
        createdBy: demoHealthWorker._id,
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
      },
      {
        patientId: p3._id,
        createdBy: demoHealthWorker._id,
        symptoms: ['Severe breathlessness', 'Chest congestion', 'Bluish nails'],
        symptomDuration: '2 days',
        vitals: { temperature: 101.8, bpSystolic: 130, bpDiastolic: 84, spo2: 87, pulse: 114 },
        pregnancyConcern: false,
        additionalObservations: 'Elderly COPD patient with acute respiratory distress and severe hypoxemia.',
        ruleLevel: 'RED',
        finalLevel: 'RED',
        triggeredRules: ['Critical SpO2 level detected (87% < 90% threshold)', 'High-urgency clinical danger symptom: "severe breathlessness"'],
        explanationEnglish: 'Urgent attention required. Critical low blood oxygen level (87%) and respiratory distress detected. The patient requires emergency oxygen stabilization and hospital admission.',
        explanationHindi: 'तत्काल डॉक्टर से परामर्श की आवश्यकता है। मरीज के शरीर में ऑक्सीजन का स्तर 87% तक गिर गया है। तुरंत ऑक्सीजन और आपातकालीन चिकित्सा की आवश्यकता है।',
        nextSteps: ['Stabilize vitals and keep oxygen support on standby', 'Arrange ambulance to CHC / District Hospital trauma center'],
        requiresHumanReview: true,
      },
    ];

    await Triage.insertMany(triageRecords);

    // 6. SEED APPOINTMENTS & LIVE QUEUE
    console.log('[Seed] Seeding appointments and patient queues...');
    const todayStr = new Date().toISOString().split('T')[0];

    const appointmentsData = [
      {
        patientId: p1._id,
        doctorId: demoDoctor._id,
        facilityId: phcKhairabad._id,
        department: 'General Medicine',
        appointmentDate: todayStr,
        appointmentTime: '10:30',
        mode: 'In-Person',
        tokenNumber: 1,
        status: 'Waiting',
        reason: 'Hypertension evaluation and routine blood sugar checkup',
        teleRoomId: null,
      },
      {
        patientId: p2._id,
        doctorId: chcDoctor._id,
        facilityId: chcLaharpur._id,
        department: 'Obstetrics & Gynaecology',
        appointmentDate: todayStr,
        appointmentTime: '11:00',
        mode: 'Online',
        tokenNumber: 2,
        status: 'In Progress',
        reason: 'Emergency antenatal teleconsultation for preeclampsia review',
        teleRoomId: 'SwasthSetu-Room-PreeclampsiaReview-2026',
      },
      {
        patientId: p3._id,
        doctorId: demoDoctor._id,
        facilityId: phcKhairabad._id,
        department: 'General Medicine',
        appointmentDate: todayStr,
        appointmentTime: '11:30',
        mode: 'In-Person',
        tokenNumber: 3,
        status: 'Scheduled',
        reason: 'Respiratory distress follow-up',
        teleRoomId: null,
      },
      {
        patientId: patients[3]._id,
        doctorId: demoDoctor._id,
        facilityId: phcKhairabad._id,
        department: 'General Medicine',
        appointmentDate: todayStr,
        appointmentTime: '09:30',
        mode: 'In-Person',
        tokenNumber: 4,
        status: 'Completed',
        reason: 'Fever and viral cold consultation',
        teleRoomId: null,
      },
      {
        patientId: patients[4]._id,
        doctorId: dhDoctor._id,
        facilityId: dhFacility._id,
        department: 'Cardiology',
        appointmentDate: todayStr,
        appointmentTime: '12:00',
        mode: 'Online',
        tokenNumber: 1,
        status: 'Scheduled',
        reason: 'Cardiac telemetry review',
        teleRoomId: 'SwasthSetu-Room-CardioSpecialist-2026',
      },
    ];

    const appointments = await Appointment.insertMany(appointmentsData);

    // 7. SEED ENCOUNTERS & PRESCRIPTIONS
    console.log('[Seed] Seeding clinical consultations and encounter records...');
    const encountersData = [
      {
        patientId: p1._id,
        doctorId: demoDoctor._id,
        facilityId: phcKhairabad._id,
        appointmentId: appointments[0]._id,
        chiefComplaint: 'Headache, neck tension, missed hypertension tablets for 4 days',
        symptoms: ['Headache', 'Dizziness'],
        observations: 'BP: 154/96 mmHg, Pulse: 78 bpm. Bilateral lung fields clear. Heart sounds regular S1S2.',
        diagnosis: 'Essential Stage 1 Hypertension with poor medication adherence',
        medicines: [
          { name: 'Amlodipine 5mg', dosage: '5mg', frequency: '1-0-0 (Once daily morning)', duration: '30 Days', instructions: 'After breakfast' },
          { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1 (Twice daily)', duration: '3 Days', instructions: 'SOS for headache' },
          { name: 'Metformin 500mg', dosage: '500mg', frequency: '0-0-1 (Once daily night)', duration: '30 Days', instructions: 'After dinner' },
        ],
        notes: 'Advised strict low salt diet, daily 30 min brisk walk, and no skipping medication. Record blood pressure at local Sub-Centre weekly.',
        followUpDate: '2026-11-09',
      },
      {
        patientId: patients[3]._id,
        doctorId: demoDoctor._id,
        facilityId: phcKhairabad._id,
        appointmentId: appointments[3]._id,
        chiefComplaint: 'Acute seasonal viral fever and runny nose',
        symptoms: ['Fever', 'Cough', 'Rhinorrhea'],
        observations: 'Temp: 100.2°F, SpO2: 98%. Pharynx congested, no exudates.',
        diagnosis: 'Acute Upper Respiratory Tract Infection (Viral)',
        medicines: [
          { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-1-1 (Thrice daily)', duration: '5 Days', instructions: 'After meals' },
          { name: 'Cetirizine 10mg', dosage: '10mg', frequency: '0-0-1 (At bedtime)', duration: '5 Days', instructions: 'May cause drowsiness' },
          { name: 'Oral Rehydration Salts (ORS)', dosage: '1 Sachet in 1L water', frequency: 'Drink throughout day', duration: '3 Days', instructions: 'Maintain hydration' },
        ],
        notes: 'Warm water gargles twice daily. Return if high fever persists beyond 3 days.',
        followUpDate: '2026-10-15',
      },
    ];

    await Encounter.insertMany(encountersData);

    // 8. SEED REFERRALS (Connected multi-tier workflow)
    console.log('[Seed] Seeding facility referral records and audit timeline...');
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 2);

    const normalDueDate = new Date();
    normalDueDate.setDate(normalDueDate.getDate() + 3);

    const referralsData = [
      // Active referral from PHC Khairabad -> CHC Laharpur
      {
        patientId: p1._id,
        fromFacilityId: phcKhairabad._id,
        toFacilityId: chcLaharpur._id,
        doctorId: demoDoctor._id,
        department: 'Cardiology',
        reason: 'Uncontrolled blood pressure and suspected hypertensive end-organ changes needing ECG & Specialist review.',
        priority: 'Urgent',
        status: 'Created',
        dueDate: normalDueDate,
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 4),
            facilityId: phcKhairabad._id,
            updatedBy: demoDoctor._id,
            note: 'Referral generated by PHC Medical Officer following persistent high BP.',
          },
        ],
      },
      // Accepted referral from Sub-Centre Rampur -> CHC Laharpur (Obstetrics)
      {
        patientId: p2._id,
        fromFacilityId: scRampur._id,
        toFacilityId: chcLaharpur._id,
        doctorId: demoDoctor._id,
        department: 'Obstetrics & Gynaecology',
        reason: 'Third trimester preeclampsia danger signs needing high-risk delivery planning and ultrasound.',
        priority: 'Emergency',
        status: 'Accepted',
        dueDate: normalDueDate,
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 24),
            facilityId: scRampur._id,
            updatedBy: demoHealthWorker._id,
            note: 'Urgent referral initiated by ASHA worker due to elevated BP and blurred vision.',
          },
          {
            status: 'Accepted',
            timestamp: new Date(Date.now() - 3600000 * 18),
            facilityId: chcLaharpur._id,
            updatedBy: chcDoctor._id,
            note: 'Referral accepted. Inpatient bed and obstetrician on standby at CHC Laharpur.',
          },
        ],
      },
      // Completed / Closed referral from CHC Laharpur -> District Hospital Sitapur
      {
        patientId: patients[4]._id,
        fromFacilityId: chcLaharpur._id,
        toFacilityId: dhFacility._id,
        doctorId: chcDoctor._id,
        department: 'Orthopedics',
        reason: 'Suspected compound fracture of femur requiring orthopedic surgery.',
        priority: 'Urgent',
        status: 'Closed',
        dueDate: overdueDate,
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 72),
            facilityId: chcLaharpur._id,
            updatedBy: chcDoctor._id,
            note: 'Referral for specialized surgical pinning.',
          },
          {
            status: 'Accepted',
            timestamp: new Date(Date.now() - 3600000 * 68),
            facilityId: dhFacility._id,
            updatedBy: dhDoctor._id,
            note: 'Accepted at Trauma Center DH Sitapur.',
          },
          {
            status: 'Arrived',
            timestamp: new Date(Date.now() - 3600000 * 60),
            facilityId: dhFacility._id,
            updatedBy: dhDoctor._id,
            note: 'Patient admitted into Orthopedic Ward.',
          },
          {
            status: 'Closed',
            timestamp: new Date(Date.now() - 3600000 * 20),
            facilityId: dhFacility._id,
            updatedBy: dhDoctor._id,
            note: 'Surgery completed successfully. Patient discharged with rehabilitation plan.',
          },
        ],
      },
      // Overdue referral for demonstration in District Admin dashboard
      {
        patientId: p3._id,
        fromFacilityId: phcKhairabad._id,
        toFacilityId: dhFacility._id,
        doctorId: demoDoctor._id,
        department: 'Pulmonology / ICU',
        reason: 'Persistent hypoxemia and COPD exacerbation needing spirometry and oxygen therapy.',
        priority: 'Emergency',
        status: 'Created',
        dueDate: overdueDate, // Past due date!
        timeline: [
          {
            status: 'Created',
            timestamp: new Date(Date.now() - 3600000 * 72),
            facilityId: phcKhairabad._id,
            updatedBy: demoDoctor._id,
            note: 'Awaiting transport and patient confirmation.',
          },
        ],
      },
    ];

    await Referral.insertMany(referralsData);

    // 9. SEED FRONTLINE FOLLOW-UPS
    console.log('[Seed] Seeding frontline health worker follow-up tasks...');
    const followUpsData = [
      {
        patientId: p1._id,
        assignedWorkerId: demoHealthWorker._id,
        program: 'Chronic Disease',
        dueDate: todayStr,
        status: 'Pending',
        notes: 'Check blood pressure and verify daily morning adherence to Amlodipine 5mg.',
      },
      {
        patientId: p2._id,
        assignedWorkerId: demoHealthWorker._id,
        program: 'Maternal',
        dueDate: todayStr,
        status: 'Flagged for Doctor',
        notes: 'High BP observed during home visit. Escort to CHC Laharpur for obstetrician checkup.',
        observations: 'Mild pedal edema noted; BP 160/100 mmHg.',
      },
      {
        patientId: patients[5]._id,
        assignedWorkerId: demoHealthWorker._id,
        program: 'Child Health',
        dueDate: '2026-10-18',
        status: 'Pending',
        notes: 'Administer DPT booster and measure weight/height for nutrition tracking.',
      },
      {
        patientId: patients[6]._id,
        assignedWorkerId: demoHealthWorker._id,
        program: 'Missed Visit',
        dueDate: '2026-10-14',
        status: 'Completed',
        notes: 'Patient missed diabetic follow-up at PHC. Visited home; patient collected medicines.',
        completedAt: new Date(),
      },
    ];

    await FollowUp.insertMany(followUpsData);

    // 10. SEED DEMO EMERGENCY ALERTS
    console.log('[Seed] Seeding emergency SOS alert...');
    const emergencyAlert = await Emergency.create({
      patientId: p3._id,
      reporterName: 'Sunita Devi (ASHA)',
      reporterPhone: '9876543211',
      location: {
        lat: 27.5120,
        lng: 80.7210,
        address: 'Near Panchayat Bhavan, Rampur Kalan Village',
        village: 'Rampur Kalan',
        district: 'Sitapur',
      },
      assignedFacilityId: chcLaharpur._id,
      severity: 'CRITICAL',
      status: 'Acknowledged',
      notes: 'Demonstration SOS alert: Patient Ramphal Maurya experiencing acute breathing distress. Oxygen support requested.',
      timeline: [
        {
          status: 'Alert Created',
          timestamp: new Date(Date.now() - 1800000),
          updatedBy: demoHealthWorker._id,
          note: 'SOS triggered by ASHA worker via mobile app',
        },
        {
          status: 'Acknowledged',
          timestamp: new Date(Date.now() - 900000),
          updatedBy: users[5]._id, // Facility Admin
          note: 'Ambulance team alerted; CHC triage bed prepared',
        },
      ],
    });

    console.log('====================================================');
    console.log('  SWASTHSETU DEMO DATABASE SEEDED SUCCESSFULLY!    ');
    console.log('====================================================');
    console.log(`  Facilities Seeded: ${facilities.length}`);
    console.log(`  Users Seeded:      ${users.length}`);
    console.log(`  Patients Seeded:   ${patients.length}`);
    console.log(`  Inventory Items:   ${inventoryToInsert.length}`);
    console.log(`  Appointments:      ${appointments.length}`);
    console.log(`  Referrals:         ${referralsData.length}`);
    console.log(`  Follow-Up Tasks:   ${followUpsData.length}`);
    console.log('----------------------------------------------------');
    console.log('  DEMO ROLES & LOGIN CREDENTIALS (OTP: 123456):      ');
    console.log('  1. Patient:         Phone: 9876543210 (Rameshwar Yadav)');
    console.log('  2. Health Worker:   Phone: 9876543211 (Sunita Devi, ASHA)');
    console.log('  3. Doctor:          Phone: 9876543212 (Dr. Alok Verma)');
    console.log('  4. Facility Admin:  Phone: 9876543213 (Rajendra Kumar)');
    console.log('  5. District Admin:  Phone: 9876543214 (Dr. S. K. Awasthi, CMO)');
    console.log('====================================================');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error] Database seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();

