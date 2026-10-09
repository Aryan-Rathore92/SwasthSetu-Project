import mongoose from 'mongoose';
import { Patient } from '../../models/Patient.js';
import { memoryStore } from '../../config/memoryStore.js';

export const getFhirPatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    let patient = null;

    if (mongoose.connection.readyState === 1) {
      if (id.startsWith('P-')) {
        patient = await Patient.findOne({ patientId: id });
      } else {
        patient = await Patient.findById(id);
      }
    } else {
      patient = memoryStore.patients.find(p => p._id === id || p.patientId === id);
    }

    if (!patient) {
      return res.status(404).json({
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'not-found',
            diagnostics: `Patient with identifier ${id} not found`,
          },
        ],
      });
    }

    const nameParts = patient.name.trim().split(' ');
    const family = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const given = nameParts.length > 1 ? nameParts.slice(0, -1) : [nameParts[0]];

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - patient.age;
    const birthDate = `${birthYear}-01-01`;

    const fhirResource = {
      resourceType: 'Patient',
      id: patient.patientId,
      meta: {
        versionId: '1',
        lastUpdated: (patient.updatedAt || new Date()).toISOString(),
        profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
      },
      identifier: [
        {
          use: 'usual',
          type: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                code: 'MR',
                display: 'Medical Record Number',
              },
            ],
          },
          system: 'https://swasthsetu.gov.in/patient-ids',
          value: patient.patientId,
        },
        ...(patient.demoAbhaId
          ? [
              {
                use: 'secondary',
                system: 'https://healthid.ndhm.gov.in/demo-abha',
                value: patient.demoAbhaId,
              },
            ]
          : []),
      ],
      active: true,
      name: [
        {
          use: 'official',
          family,
          given,
          text: patient.name,
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: patient.phone,
          use: 'mobile',
        },
      ],
      gender: patient.gender.toLowerCase() === 'female' ? 'female' : patient.gender.toLowerCase() === 'male' ? 'male' : 'other',
      birthDate,
      address: [
        {
          use: 'home',
          line: [patient.address || `Village ${patient.village}`],
          city: patient.village,
          district: patient.district,
          state: 'State Health Jurisdiction',
          country: 'IND',
        },
      ],
      extension: [
        {
          url: 'https://swasthsetu.gov.in/fhir/StructureDefinition/community-risk-level',
          valueString: patient.riskLevel,
        },
      ],
    };

    res.setHeader('Content-Type', 'application/fhir+json');
    res.json(fhirResource);
  } catch (err) {
    next(err);
  }
};

