/**
 * SwasthSetu Demonstration Triage Engine
 * 
 * DISCLAIMER:
 * This rule-based triage system is designed strictly for hackathon demonstration purposes.
 * It is NOT clinically validated, NOT certified as a medical device, and MUST NEVER replace
 * the professional judgment of qualified doctors and healthcare workers.
 */

export const evaluateTriageRules = ({ symptoms = [], vitals = {}, pregnancyConcern = false, additionalObservations = '' }) => {
  const triggeredRules = [];
  let ruleLevel = 'GREEN';

  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
  const notes = (additionalObservations || '').toLowerCase();

  const {
    temperature, // in Fahrenheit or Celsius (>45 treated as F, <=45 converted to F)
    bpSystolic,
    bpDiastolic,
    spo2,
    bloodSugar,
    pulse,
  } = vitals;

  // Normalize temperature to Fahrenheit
  let tempF = null;
  if (temperature) {
    tempF = temperature > 45 ? temperature : (temperature * 9) / 5 + 32;
  }

  // --- RED PRIORITY RULES (Immediate / Urgent Clinical Attention) ---
  if (spo2 && spo2 < 90) {
    triggeredRules.push(`Critical SpO2 level detected (${spo2}% < 90% threshold)`);
    ruleLevel = 'RED';
  }

  if (bpSystolic && bpSystolic >= 180) {
    triggeredRules.push(`Severe hypertensive crisis risk: Systolic BP ${bpSystolic} mmHg (>= 180 mmHg)`);
    ruleLevel = 'RED';
  }
  if (bpDiastolic && bpDiastolic >= 120) {
    triggeredRules.push(`Severe hypertensive crisis risk: Diastolic BP ${bpDiastolic} mmHg (>= 120 mmHg)`);
    ruleLevel = 'RED';
  }

  if (bpSystolic && bpSystolic < 85) {
    triggeredRules.push(`Critical low blood pressure / shock indicator: Systolic BP ${bpSystolic} mmHg (< 85 mmHg)`);
    ruleLevel = 'RED';
  }

  if (tempF && tempF >= 104) {
    triggeredRules.push(`High hyperpyrexia risk: Temperature ${tempF.toFixed(1)}°F (>= 104°F)`);
    ruleLevel = 'RED';
  }

  // Red Symptoms
  const redKeywords = [
    'chest pain',
    'difficulty breathing',
    'shortness of breath',
    'severe breathlessness',
    'loss of consciousness',
    'unconscious',
    'convulsion',
    'seizure',
    'uncontrolled bleeding',
    'severe trauma',
    'cyanosis',
    'blue lips',
    'stiff neck with fever',
    'severe allergic reaction',
    'anaphylaxis'
  ];

  for (const kw of redKeywords) {
    if (normalizedSymptoms.some(s => s.includes(kw)) || notes.includes(kw)) {
      triggeredRules.push(`High-urgency clinical danger symptom: "${kw}"`);
      ruleLevel = 'RED';
    }
  }

  // Pregnancy high-risk danger signs
  if (pregnancyConcern) {
    const pregnancyRedKeywords = ['vaginal bleeding', 'severe headache', 'blurred vision', 'convulsions', 'water break', 'labour pain'];
    for (const kw of pregnancyRedKeywords) {
      if (normalizedSymptoms.some(s => s.includes(kw)) || notes.includes(kw)) {
        triggeredRules.push(`Maternal high-risk danger sign: "${kw}" during pregnancy`);
        ruleLevel = 'RED';
      }
    }
    if ((bpSystolic && bpSystolic >= 140) || (bpDiastolic && bpDiastolic >= 90)) {
      triggeredRules.push(`High BP in pregnancy (Preeclampsia indicator): ${bpSystolic}/${bpDiastolic} mmHg`);
      ruleLevel = 'RED';
    }
  }

  // --- YELLOW PRIORITY RULES (Needs Timely Clinical Review) ---
  if (ruleLevel !== 'RED') {
    if (spo2 && spo2 >= 90 && spo2 <= 94) {
      triggeredRules.push(`Moderate hypoxemia observation: SpO2 ${spo2}% (90-94% range)`);
      ruleLevel = 'YELLOW';
    }

    if ((bpSystolic && bpSystolic >= 140 && bpSystolic < 180) || (bpDiastolic && bpDiastolic >= 90 && bpDiastolic < 120)) {
      triggeredRules.push(`Elevated blood pressure: ${bpSystolic || '-'}/${bpDiastolic || '-'} mmHg`);
      ruleLevel = 'YELLOW';
    }

    if (tempF && tempF >= 101 && tempF < 104) {
      triggeredRules.push(`Moderate-to-high fever: ${tempF.toFixed(1)}°F`);
      ruleLevel = 'YELLOW';
    }

    if (bloodSugar && (bloodSugar >= 250 || bloodSugar <= 65)) {
      triggeredRules.push(`Abnormal blood glucose level: ${bloodSugar} mg/dL`);
      ruleLevel = 'YELLOW';
    }

    if (pulse && (pulse >= 120 || pulse <= 50)) {
      triggeredRules.push(`Abnormal pulse rate: ${pulse} bpm`);
      ruleLevel = 'YELLOW';
    }

    const yellowKeywords = [
      'high fever',
      'fever for > 3 days',
      'fever for more than 3 days',
      'persistent vomiting',
      'dehydration',
      'severe abdominal pain',
      'deep wound',
      'infection',
      'productive cough with blood',
      'jaundice',
      'yellow eyes'
    ];

    for (const kw of yellowKeywords) {
      if (normalizedSymptoms.some(s => s.includes(kw)) || notes.includes(kw)) {
        triggeredRules.push(`Clinical observation needing review: "${kw}"`);
        ruleLevel = 'YELLOW';
      }
    }

    if (pregnancyConcern) {
      triggeredRules.push('Pregnancy status flagged for routine antenatal checkup/review');
      ruleLevel = 'YELLOW';
    }
  }

  // If no triggers, it defaults to GREEN
  if (triggeredRules.length === 0) {
    triggeredRules.push('Vitals and recorded symptoms fall within standard non-urgent baseline range.');
  }

  // Prescribed Next Steps based on priority
  let nextSteps = [];
  if (ruleLevel === 'RED') {
    nextSteps = [
      'Immediately alert the duty medical officer / doctor',
      'Stabilize vitals and keep oxygen support on standby',
      'Prepare emergency transfer or ambulance to CHC/District Hospital if specialized care is needed',
      'Do not delay for non-essential administrative steps'
    ];
  } else if (ruleLevel === 'YELLOW') {
    nextSteps = [
      'Schedule clinical consultation within the next 4 to 24 hours',
      'Monitor and re-record vitals (Blood pressure, Temperature, SpO2)',
      'Review existing chronic medication adherence',
      'Advise patient on danger signs that necessitate immediate hospital visit'
    ];
  } else {
    nextSteps = [
      'Provide routine primary care or supportive home management advice',
      'Ensure adequate hydration and rest',
      'Schedule follow-up visit with ASHA/ANM within 3-5 days if symptoms persist',
      'Encourage regular preventive checkups at nearest Sub-Centre or PHC'
    ];
  }

  return {
    ruleLevel,
    triggeredRules,
    nextSteps,
    requiresHumanReview: true,
  };
};

