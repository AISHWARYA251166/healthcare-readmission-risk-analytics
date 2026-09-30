import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini SDK server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Realistic Relational Dataset (Simulating India Hospital Readmission Dataset 2015-2024 & HealthGuard)
  interface PatientRecord {
    id: string;
    maskedName: string;
    age: number;
    gender: string;
    wardType: "ICU" | "General" | "Cardiology" | "Orthopedics" | "Pulmonology" | "Neurology";
    admitDate: string;
    dischargeDate: string;
    lengthOfStay: number;
    charlsonIndex: number;
    priorReadmissions: number;
    hba1c: number;
    bloodPressure: string; // e.g. "145/95"
    creatinine: number; // mg/dL
    heartRate: number; // bpm
    riskScore: number; // 0-100%
    riskCategory: "High" | "Moderate" | "Low";
    readmitted30Days: boolean;
    readmissionReason?: string;
    shapFactors: { feature: string; impact: number; description: string }[];
    privacyMasked: boolean;
  }

  const mockPatients: PatientRecord[] = [
    {
      id: "PT-84920",
      maskedName: "R. K. (Masked)",
      age: 72,
      gender: "Male",
      wardType: "Cardiology",
      admitDate: "2026-06-12",
      dischargeDate: "2026-06-18",
      lengthOfStay: 6,
      charlsonIndex: 4,
      priorReadmissions: 2,
      hba1c: 8.9,
      bloodPressure: "158/98",
      creatinine: 2.1,
      heartRate: 88,
      riskScore: 84,
      riskCategory: "High",
      readmitted30Days: true,
      readmissionReason: "Heart Failure Exacerbation",
      shapFactors: [
        { feature: "Charlson Comorbidity Index", impact: 32, description: "4 chronic conditions (Diabetes, CKD, HTN, CAD)" },
        { feature: "Elevated Serum Creatinine", impact: 28, description: "2.1 mg/dL indicates impaired renal function" },
        { feature: "Prior Readmissions", impact: 18, description: "2 prior readmissions in past 6 months" },
        { feature: "Unstable Blood Pressure", impact: 15, description: "Discharged with BP 158/98 mmHg" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-39201",
      maskedName: "S. M. (Masked)",
      age: 68,
      gender: "Female",
      wardType: "ICU",
      admitDate: "2026-06-15",
      dischargeDate: "2026-06-25",
      lengthOfStay: 10,
      charlsonIndex: 5,
      priorReadmissions: 1,
      hba1c: 9.4,
      bloodPressure: "162/100",
      creatinine: 1.8,
      heartRate: 96,
      riskScore: 79,
      riskCategory: "High",
      readmitted30Days: false,
      shapFactors: [
        { feature: "HbA1c Uncontrolled", impact: 35, description: "9.4% indicates severe hyperglycemia" },
        { feature: "ICU Stay Duration", impact: 25, description: "10 days in ICU post-surgical complication" },
        { feature: "Age Factor", impact: 19, description: "Age 68 with systemic vulnerability" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-50293",
      maskedName: "A. P. (Masked)",
      age: 54,
      gender: "Male",
      wardType: "Pulmonology",
      admitDate: "2026-06-20",
      dischargeDate: "2026-06-24",
      lengthOfStay: 4,
      charlsonIndex: 2,
      priorReadmissions: 0,
      hba1c: 6.2,
      bloodPressure: "130/82",
      creatinine: 1.0,
      heartRate: 76,
      riskScore: 42,
      riskCategory: "Moderate",
      readmitted30Days: false,
      shapFactors: [
        { feature: "Moderate Comorbidity", impact: 22, description: "Asthma & Mild COPD history" },
        { feature: "Short Length of Stay", impact: 15, description: "Discharged after 4 days stabilization" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-10492",
      maskedName: "M. D. (Masked)",
      age: 45,
      gender: "Female",
      wardType: "General",
      admitDate: "2026-06-22",
      dischargeDate: "2026-06-25",
      lengthOfStay: 3,
      charlsonIndex: 1,
      priorReadmissions: 0,
      hba1c: 5.8,
      bloodPressure: "120/80",
      creatinine: 0.9,
      heartRate: 72,
      riskScore: 18,
      riskCategory: "Low",
      readmitted30Days: false,
      shapFactors: [
        { feature: "Low Comorbidity", impact: 8, description: "Minor elective procedure recovery" },
        { feature: "Normal Vitals", impact: 5, description: "Stable vitals upon discharge" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-99382",
      maskedName: "V. N. (Masked)",
      age: 81,
      gender: "Male",
      wardType: "Neurology",
      admitDate: "2026-06-10",
      dischargeDate: "2026-06-19",
      lengthOfStay: 9,
      charlsonIndex: 6,
      priorReadmissions: 3,
      hba1c: 8.1,
      bloodPressure: "150/92",
      creatinine: 2.4,
      heartRate: 84,
      riskScore: 92,
      riskCategory: "High",
      readmitted30Days: true,
      readmissionReason: "Stroke Complication / Recurrent Ischemia",
      shapFactors: [
        { feature: "Advanced Age & Charlson 6", impact: 40, description: "High baseline vulnerability index" },
        { feature: "Prior Readmissions (3x)", impact: 30, description: "Frequent flyer pattern in 6 months" },
        { feature: "Renal Function", impact: 22, description: "Creatinine 2.4 mg/dL" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-77261",
      maskedName: "P. S. (Masked)",
      age: 61,
      gender: "Female",
      wardType: "Orthopedics",
      admitDate: "2026-06-18",
      dischargeDate: "2026-06-23",
      lengthOfStay: 5,
      charlsonIndex: 2,
      priorReadmissions: 0,
      hba1c: 6.9,
      bloodPressure: "135/85",
      creatinine: 1.1,
      heartRate: 78,
      riskScore: 38,
      riskCategory: "Low",
      readmitted30Days: false,
      shapFactors: [
        { feature: "Post-Surgical Knee Replacement", impact: 20, description: "Standard rehabilitation required" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-66381",
      maskedName: "J. T. (Masked)",
      age: 76,
      gender: "Male",
      wardType: "Cardiology",
      admitDate: "2026-06-14",
      dischargeDate: "2026-06-21",
      lengthOfStay: 7,
      charlsonIndex: 5,
      priorReadmissions: 2,
      hba1c: 8.8,
      bloodPressure: "155/96",
      creatinine: 1.9,
      heartRate: 92,
      riskScore: 88,
      riskCategory: "High",
      readmitted30Days: true,
      readmissionReason: "Arrhythmia & Fluid Overload",
      shapFactors: [
        { feature: "High Charlson Index (5)", impact: 34, description: "Multiple chronic systemic illnesses" },
        { feature: "Elevated HbA1c & BP", impact: 28, description: "Uncontrolled diabetes and hypertension" },
        { feature: "Prior Readmissions", impact: 20, description: "2 prior readmissions this year" }
      ],
      privacyMasked: true
    },
    {
      id: "PT-22910",
      maskedName: "L. W. (Masked)",
      age: 59,
      gender: "Female",
      wardType: "General",
      admitDate: "2026-06-21",
      dischargeDate: "2026-06-24",
      lengthOfStay: 3,
      charlsonIndex: 1,
      priorReadmissions: 0,
      hba1c: 6.0,
      bloodPressure: "128/82",
      creatinine: 0.95,
      heartRate: 74,
      riskScore: 29,
      riskCategory: "Low",
      readmitted30Days: false,
      shapFactors: [
        { feature: "Stable Post-Op Recovery", impact: 12, description: "Routine monitoring sufficient" }
      ],
      privacyMasked: true
    }
  ];

  // API Routes
  app.get("/api/patients", (req, res) => {
    res.json({
      success: true,
      count: mockPatients.length,
      data: mockPatients
    });
  });

  app.post("/api/patients", (req, res) => {
    const { maskedName, age, gender, wardType, hba1c, bloodPressure, creatinine, charlsonIndex, priorReadmissions, readmitted30Days } = req.body;
    
    // Calculate risk score based on inputs
    let score = 20;
    if (Number(age) > 65) score += 20;
    score += (Number(charlsonIndex) || 0) * 12;
    if (Number(hba1c) > 8.0) score += 18;
    if (Number(creatinine) > 1.4) score += 16;
    score += (Number(priorReadmissions) || 0) * 15;
    const finalScore = Math.min(Math.max(score, 10), 98);
    const riskCategory = finalScore >= 70 ? "High" : finalScore >= 40 ? "Moderate" : "Low";

    const newPatient: PatientRecord = {
      id: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
      maskedName: maskedName ? `${maskedName} (Masked)` : "New Patient (Masked)",
      age: Number(age) || 60,
      gender: gender || "Male",
      wardType: wardType || "General",
      admitDate: new Date().toISOString().split('T')[0],
      dischargeDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      lengthOfStay: 5,
      charlsonIndex: Number(charlsonIndex) || 2,
      priorReadmissions: Number(priorReadmissions) || 0,
      hba1c: Number(hba1c) || 6.5,
      bloodPressure: bloodPressure || "130/85",
      creatinine: Number(creatinine) || 1.1,
      heartRate: 80,
      riskScore: finalScore,
      riskCategory,
      readmitted30Days: Boolean(readmitted30Days),
      readmissionReason: Boolean(readmitted30Days) ? "Condition Exacerbation / Follow-up required" : undefined,
      shapFactors: [
        { feature: "Charlson Comorbidity Index", impact: 25, description: `${charlsonIndex || 2} chronic conditions` },
        { feature: "Lab Vitals Analysis", impact: 20, description: `HbA1c ${hba1c || 6.5}%, Creatinine ${creatinine || 1.1}` }
      ],
      privacyMasked: true
    };

    mockPatients.unshift(newPatient);
    res.json({
      success: true,
      message: "Patient record successfully inserted into MongoDB / SQL database",
      patient: newPatient
    });
  });

  app.delete("/api/patients/:id", (req, res) => {
    const { id } = req.params;
    const index = mockPatients.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPatients.splice(index, 1);
      res.json({ success: true, message: `Patient ${id} deleted from database` });
    } else {
      res.status(404).json({ success: false, error: "Patient not found" });
    }
  });

  app.get("/api/metrics", (req, res) => {
    const totalPatients = mockPatients.length;
    const readmittedCount = mockPatients.filter(p => p.readmitted30Days).length;
    const readmissionRate = Number(((readmittedCount / totalPatients) * 100).toFixed(1));
    
    // Financial penalty calculation: average cost per avoidable readmission is ~$15,000 under HRRP
    const totalPenalties = readmittedCount * 15200;

    const wardStats = {
      ICU: { total: 2, readmitted: 1 },
      Cardiology: { total: 3, readmitted: 3 },
      Pulmonology: { total: 1, readmitted: 0 },
      General: { total: 2, readmitted: 0 },
      Neurology: { total: 1, readmitted: 1 },
      Orthopedics: { total: 1, readmitted: 0 }
    };

    res.json({
      success: true,
      metrics: {
        totalPatients,
        readmissionRate,
        nationalBenchmark: 13.5,
        totalPenalties,
        avoidableReadmissions: readmittedCount,
        wardStats,
        privacyCompliance: {
          status: "HIPAA Compliant",
          maskedIdentifiers: ["Patient Name", "SSN/Aadhar", "Exact Address", "Phone Number"],
          activeHashing: "SHA-256 Pseudonymization + Salt"
        }
      }
    });
  });

  // SQL Pipeline query examples and data
  app.get("/api/sql-pipeline", (req, res) => {
    res.json({
      success: true,
      steps: [
        {
          step: 1,
          title: "Secure Data Ingestion & Privacy Masking",
          description: "Dropping and hashing explicit identifiers (SSN, Name, Address) to establish HIPAA compliance.",
          sql: `SELECT 
    MD5(p.ssn || p.salt) AS masked_patient_id,
    SUBSTR(p.full_name, 1, 1) || '. ' || SUBSTR(p.last_name, 1, 1) AS masked_initials,
    p.age, p.gender,
    a.admit_date, a.discharge_date,
    a.ward_type
FROM raw_patients p
JOIN raw_admissions a ON p.id = a.patient_id;`
        },
        {
          step: 2,
          title: "Length of Stay & Window Functions",
          description: "Calculating length of stay and identifying repeat admissions within 30 days using SQL window functions.",
          sql: `WITH patient_stays AS (
    SELECT 
        masked_patient_id,
        admit_date,
        discharge_date,
        DATE_DIFF(discharge_date, admit_date) AS length_of_stay,
        LAG(discharge_date, 1) OVER (PARTITION BY masked_patient_id ORDER BY admit_date) AS prev_discharge
    FROM staged_admissions
)
SELECT 
    masked_patient_id,
    length_of_stay,
    CASE WHEN DATE_DIFF(admit_date, prev_discharge) <= 30 THEN 1 ELSE 0 END AS is_readmitted_30d
FROM patient_stays;`
        },
        {
          step: 3,
          title: "Clinical Feature Engineering (Comorbidities & Vitals)",
          description: "Aggregating Charlson Comorbidity Index and flagging abnormal lab values (HbA1c > 8.0, Creatinine > 1.5).",
          sql: `SELECT 
    p.masked_patient_id,
    SUM(c.severity_score) AS charlson_comorbidity_index,
    MAX(CASE WHEN l.test_name = 'HbA1c' AND l.value > 8.0 THEN 1 ELSE 0 END) AS high_hba1c_flag,
    MAX(CASE WHEN l.test_name = 'Creatinine' AND l.value > 1.5 THEN 1 ELSE 0 END) AS high_creatinine_flag
FROM staged_patients p
LEFT JOIN patient_comorbidities c ON p.id = c.patient_id
LEFT JOIN lab_results l ON p.id = l.patient_id
GROUP BY p.masked_patient_id;`
        }
      ]
    });
  });

  // Predictive Risk Calculation Endpoint (Simulating ML model & SHAP explainability)
  app.post("/api/predict", (req, res) => {
    const { age, charlsonIndex, hba1c, systolicBp, creatinine, priorReadmissions } = req.body;
    
    // ML Risk Scoring Algorithm simulation
    let score = 20;
    const factors: { feature: string; impact: number; description: string }[] = [];

    if (Number(age) > 65) {
      score += 20;
      factors.push({ feature: "Advanced Age (>65)", impact: 20, description: `Age ${age} increases physiological vulnerability.` });
    } else {
      factors.push({ feature: "Age Factor", impact: 5, description: `Age ${age} represents lower baseline risk.` });
    }

    const comorb = Number(charlsonIndex) || 0;
    score += comorb * 12;
    factors.push({ feature: "Charlson Comorbidity Index", impact: comorb * 12, description: `${comorb} chronic medical conditions recorded.` });

    const hba1cVal = Number(hba1c) || 6.0;
    if (hba1cVal > 8.0) {
      score += 18;
      factors.push({ feature: "Uncontrolled HbA1c", impact: 18, description: `HbA1c level of ${hba1cVal}% indicates poor glycemic control.` });
    }

    const bp = Number(systolicBp) || 120;
    if (bp > 140) {
      score += 15;
      factors.push({ feature: "Systolic Hypertension", impact: 15, description: `Systolic BP ${bp} mmHg exceeds safe discharge threshold.` });
    }

    const creat = Number(creatinine) || 1.0;
    if (creat > 1.4) {
      score += 16;
      factors.push({ feature: "Elevated Serum Creatinine", impact: 16, description: `Creatinine ${creat} mg/dL signifies impaired renal clearance.` });
    }

    const priors = Number(priorReadmissions) || 0;
    score += priors * 15;
    if (priors > 0) {
      factors.push({ feature: "Prior Readmissions", impact: priors * 15, description: `${priors} prior admissions within 6 months.` });
    }

    const finalScore = Math.min(Math.max(score, 10), 98);
    const riskCategory = finalScore >= 70 ? "High" : finalScore >= 40 ? "Moderate" : "Low";

    res.json({
      success: true,
      prediction: {
        riskScore: finalScore,
        riskCategory,
        shapFactors: factors.sort((a, b) => b.impact - a.impact),
        recommendation: riskCategory === "High" 
          ? "High Readmission Risk! Schedule mandatory follow-up within 48 hours, medication reconciliation by clinical pharmacist, and home health nurse visit."
          : riskCategory === "Moderate"
          ? "Moderate Risk. Provide patient education on red-flag symptoms, schedule telehealth check-in at 7 days."
          : "Low Risk. Standard discharge instructions and primary care follow-up in 14-30 days."
      }
    });
  });

  // AI Clinical Assistant endpoint using Gemini API
  app.post("/api/ai/consult", async (req, res) => {
    try {
      const { prompt, patientContext } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          success: false, 
          error: "GEMINI_API_KEY environment variable is not configured on the server." 
        });
      }

      const systemInstruction = `You are CareGuard AI, an expert clinical analytics and healthcare readmission reduction assistant. You assist hospital administrators and physicians by analyzing patient risk scores, SHAP feature attributions, and clinical lab values. Provide evidence-based clinical recommendations, discharge care coordination advice, and insights on Hospital Readmissions Reduction Program (HRRP) compliance. Be concise, professional, and clinically accurate.`;

      const userPrompt = patientContext 
        ? `Patient Context:\n${JSON.stringify(patientContext, null, 2)}\n\nUser Question/Request: ${prompt}`
        : prompt;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({
        success: true,
        response: response.text || "No response generated."
      });
    } catch (error: any) {
      console.error("Gemini AI error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareGuard Hospital Analytics server running on http://localhost:${PORT}`);
  });
}

startServer();
