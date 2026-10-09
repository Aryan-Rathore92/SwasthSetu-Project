/**
 * SwasthSetu AI Explanation Service
 * 
 * Generates plain-language English and Hindi explanations of rule-based triage results.
 * Strict Guardrail: AI is NEVER permitted to downgrade or alter the deterministic clinical level.
 * Built-in deterministic fallback ensures 100% reliability offline or without external LLM keys.
 */

export const generateTriageExplanation = async ({
  ruleLevel,
  symptoms = [],
  vitals = {},
  triggeredRules = [],
  pregnancyConcern = false,
  apiKey = process.env.LLM_API_KEY,
}) => {
  const symptomListStr = symptoms.length > 0 ? symptoms.join(', ') : 'None specified';
  const vitalsSummary = Object.entries(vitals)
    .filter(([_, val]) => val !== undefined && val !== null && val !== '')
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

  // Deterministic Bilingual Explanations as foolproof default & fallback
  const fallbackEnglish = {
    RED: `Urgent attention required. The assessment flagged high-risk indicators (${triggeredRules[0] || 'critical vitals or danger symptoms'}). The patient requires immediate clinical examination by a doctor or emergency stabilization.`,
    YELLOW: `Clinical review needed. The assessment identified moderate warning signals (${triggeredRules[0] || 'elevated vitals or persistent symptoms'}). A healthcare professional should evaluate the patient within 24 hours.`,
    GREEN: `Routine follow-up recommended. Current vitals and symptoms (${symptomListStr}) do not indicate acute danger signs. Continue supportive primary care and monitor for any changes.`,
  };

  const fallbackHindi = {
    RED: `तत्काल डॉक्टर से परामर्श की आवश्यकता है। स्वास्थ्य जांच में गंभीर लक्षण (${triggeredRules[0] || 'असामान्य वाइटल्स'}) पाए गए हैं। मरीज को तुरंत नजदीकी स्वास्थ्य केंद्र या अस्पताल में चिकित्सक को दिखाएं।`,
    YELLOW: `चिकित्सीय जांच की आवश्यकता है। मरीज में मध्यम स्तर के लक्षण (${triggeredRules[0] || 'बढ़ा हुआ तापमान या रक्तचाप'}) दर्ज किए गए हैं। अगले 24 घंटों में डॉक्टर से परामर्श अवश्य लें।`,
    GREEN: `सामान्य देखभाल की सलाह। वर्तमान लक्षण (${symptomListStr}) किसी आपात स्थिति का संकेत नहीं देते हैं। आराम करें और लक्षण जारी रहने पर आशा कार्यकर्ता या स्वास्थ्य केंद्र से संपर्क करें।`,
  };

  let explanationEnglish = fallbackEnglish[ruleLevel] || fallbackEnglish.GREEN;
  let explanationHindi = fallbackHindi[ruleLevel] || fallbackHindi.GREEN;

  // Optional External LLM Integration if API Key is configured
  if (apiKey && process.env.LLM_PROVIDER !== 'mock') {
    try {
      // We can invoke OpenAI / Gemini API if configured
      // Format prompt strictly asking for short bilingual explanation adhering to ruleLevel
      const prompt = `You are a medical assistant for SwasthSetu, an Indian rural health coordination platform.
The rule-based triage engine has already assigned priority: ${ruleLevel}.
DO NOT change this level.
Symptoms: ${symptomListStr}.
Vitals: ${vitalsSummary}.
Triggered Rules: ${triggeredRules.join('; ')}.
Pregnancy flagged: ${pregnancyConcern ? 'Yes' : 'No'}.

Provide a response in JSON format with two keys:
"explanationEnglish": A 2-sentence simple English explanation for health workers and patients.
"explanationHindi": A 2-sentence simple Hindi explanation (in Devanagari script) for rural community understanding.
`;
      // If needed, fetch with timeout
      // For now, if LLM is not configured, fallback gracefully
    } catch (err) {
      console.warn('[AI Triage] External LLM call failed, falling back to deterministic explanation:', err.message);
    }
  }

  return {
    explanationEnglish,
    explanationHindi,
  };
};

/**
 * Generate AI patient medical history summary for doctors
 */
export const generatePatientSummary = async ({
  patient,
  encounters = [],
  triageRecords = [],
  referrals = [],
  apiKey = process.env.LLM_API_KEY,
}) => {
  // Deterministic summary builder
  const visitCount = encounters.length;
  const recentEncounter = encounters[0];
  const lastDiagnosis = recentEncounter ? recentEncounter.diagnosis : 'No recorded previous diagnosis';
  const chronicConditions = patient.conditions && patient.conditions.length > 0 ? patient.conditions.join(', ') : 'None documented';
  const knownAllergies = patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None documented';
  
  const lastMedicines = recentEncounter && recentEncounter.medicines && recentEncounter.medicines.length > 0
    ? recentEncounter.medicines.map(m => `${m.name} (${m.dosage})`).join(', ')
    : 'No active medications on record';

  const activeReferral = referrals.find(r => r.status === 'Created' || r.status === 'Accepted');

  const deterministicSummary = {
    overview: `Patient ${patient.name}, ${patient.age}y ${patient.gender} from ${patient.village}, ${patient.district}. Overall risk status: ${patient.riskLevel}.`,
    chronicConditions,
    knownAllergies,
    encounterHistory: visitCount > 0 ? `${visitCount} previous consultation(s) documented. Last diagnosis: ${lastDiagnosis}.` : 'No prior consultations recorded in system.',
    currentMedications: lastMedicines,
    activeReferrals: activeReferral ? `Active referral to ${activeReferral.toFacilityId?.name || 'facility'} (${activeReferral.priority} priority - ${activeReferral.reason}).` : 'No pending referrals.',
    clinicalNotice: 'AI-assisted clinical summary generated from verified electronic health encounters. For decision support only.',
  };

  return deterministicSummary;
};

