import PDFDocument from 'pdfkit';

/**
 * Generates an e-prescription PDF stream using PDFKit
 * Includes SwasthSetu branding, patient details, medicine table, and prominent DEMO watermark
 */
export const generatePrescriptionPdf = ({
  patient,
  doctor,
  facility,
  diagnosis,
  medicines = [],
  notes = '',
  followUpDate = null,
  encounterDate = new Date(),
}) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `Prescription - ${patient.name} (${patient.patientId})`,
      Author: 'SwasthSetu Healthcare Coordination Platform',
    },
  });

  // Background Demo Watermark
  doc.save();
  doc.rotate(-35, { origin: [300, 420] });
  doc.fontSize(45);
  doc.fillColor('#F3F4F6', 0.5);
  doc.text('DEMO - NOT VALID FOR CLINICAL USE', 50, 400, {
    align: 'center',
    width: 500,
  });
  doc.restore();

  // Header Banner
  doc.rect(40, 40, 515, 65).fill('#123B5D');
  doc.fillColor('#FFFFFF');
  doc.fontSize(20).font('Helvetica-Bold').text('SWASTHSETU HEALTHCARE', 55, 52);
  doc.fontSize(9).font('Helvetica').text('Digital Health Coordination System | Rural Healthcare Initiative', 55, 75);
  doc.fontSize(9).text(`FACILITY: ${facility?.name || 'Primary Health Centre'}`, 55, 88);

  // Doctor & Facility Info Header
  doc.fillColor('#172B3A');
  doc.fontSize(10).font('Helvetica-Bold').text(`Dr. ${doctor?.name || 'Medical Officer'}`, 360, 52, { align: 'right', width: 180 });
  doc.fontSize(8).font('Helvetica').text(`Reg: ${doctor?.registrationNumber || 'MCI-DEMO-2026'}`, 360, 66, { align: 'right', width: 180 });
  doc.text(`Dept: ${doctor?.department || 'General Medicine'}`, 360, 78, { align: 'right', width: 180 });
  doc.text(`Date: ${new Date(encounterDate).toLocaleDateString('en-IN')}`, 360, 90, { align: 'right', width: 180 });

  doc.moveDown(3);

  // Patient Info Box
  const patientY = 120;
  doc.rect(40, patientY, 515, 60).fillAndStroke('#F8FAFC', '#E2E8F0');
  doc.fillColor('#123B5D').fontSize(10).font('Helvetica-Bold').text('PATIENT INFORMATION', 50, patientY + 8);

  doc.fillColor('#334155').fontSize(9).font('Helvetica');
  doc.text(`Name: ${patient.name}`, 50, patientY + 24);
  doc.text(`Age / Gender: ${patient.age} Yrs / ${patient.gender}`, 50, patientY + 38);
  doc.text(`Patient ID: ${patient.patientId}`, 230, patientY + 24);
  doc.text(`Village / District: ${patient.village || 'N/A'}, ${patient.district || 'N/A'}`, 230, patientY + 38);
  doc.text(`Phone: ${patient.phone}`, 420, patientY + 24);
  doc.text(`Demo ABHA: ${patient.demoAbhaId || 'Not Linked'}`, 420, patientY + 38);

  // Clinical Diagnosis
  const diagY = 195;
  doc.rect(40, diagY, 515, 38).fillAndStroke('#F1F5F9', '#CBD5E1');
  doc.fillColor('#123B5D').fontSize(9).font('Helvetica-Bold').text('CLINICAL DIAGNOSIS & CHIEF COMPLAINT:', 50, diagY + 8);
  doc.fillColor('#0F172A').fontSize(10).font('Helvetica').text(diagnosis || 'Clinical evaluation completed', 50, diagY + 22);

  // Prescription / Medicine Table
  const tableY = 248;
  doc.rect(40, tableY, 515, 24).fill('#109ECC');
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
  doc.text('Rx #', 48, tableY + 7);
  doc.text('Medicine Name', 80, tableY + 7);
  doc.text('Dosage', 240, tableY + 7);
  doc.text('Frequency', 310, tableY + 7);
  doc.text('Duration', 390, tableY + 7);
  doc.text('Instructions', 450, tableY + 7);

  let currentY = tableY + 24;
  medicines.forEach((med, idx) => {
    const isEven = idx % 2 === 0;
    doc.rect(40, currentY, 515, 24).fill(isEven ? '#FFFFFF' : '#F8FAFC');

    doc.fillColor('#334155').fontSize(8).font('Helvetica');
    doc.text(`${idx + 1}`, 48, currentY + 7);
    doc.font('Helvetica-Bold').fillColor('#0F172A').text(med.name, 80, currentY + 7, { width: 155, ellipsis: true });
    doc.font('Helvetica').fillColor('#334155');
    doc.text(med.dosage || '-', 240, currentY + 7);
    doc.text(med.frequency || '-', 310, currentY + 7);
    doc.text(med.duration || '-', 390, currentY + 7);
    doc.text(med.instructions || 'After food', 450, currentY + 7, { width: 100, ellipsis: true });

    currentY += 24;
  });

  // Clinical Notes & Advice
  currentY += 15;
  doc.rect(40, currentY, 515, 60).stroke('#E2E8F0');
  doc.fillColor('#123B5D').fontSize(9).font('Helvetica-Bold').text('SPECIAL INSTRUCTIONS & LIFESTYLE ADVICE:', 50, currentY + 8);
  doc.fillColor('#334155').fontSize(8).font('Helvetica').text(
    notes || 'Take prescribed medications regularly. Maintain proper hydration and contact ASHA worker if symptoms worsen.',
    50,
    currentY + 22,
    { width: 495 }
  );

  // Follow-up Date
  currentY += 70;
  if (followUpDate) {
    doc.fillColor('#DC2626').fontSize(9).font('Helvetica-Bold').text(`NEXT FOLLOW-UP REVIEW DATE: ${followUpDate}`, 50, currentY);
  }

  // Doctor Signature area
  doc.fillColor('#172B3A').fontSize(8).font('Helvetica-Bold').text(`Digitally Authorized by: Dr. ${doctor?.name || 'Medical Officer'}`, 360, currentY + 30, { align: 'right', width: 180 });
  doc.font('Helvetica').text('SwasthSetu Tele-Health Portal Verification', 360, currentY + 42, { align: 'right', width: 180 });

  // Footer Disclaimer
  doc.rect(40, 770, 515, 30).fill('#FEF2F2');
  doc.fillColor('#991B1B').fontSize(7.5).font('Helvetica-Bold').text(
    'HACKATHON DEMO PRESCRIPTION — STRICTLY NOT FOR REAL MEDICAL DISPENSING OR PRODUCTION CLINICAL USE',
    45,
    780,
    { align: 'center', width: 505 }
  );

  return doc;
};

