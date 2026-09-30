export interface PatientRecord {
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
  bloodPressure: string;
  creatinine: number;
  heartRate: number;
  riskScore: number;
  riskCategory: "High" | "Moderate" | "Low";
  readmitted30Days: boolean;
  readmissionReason?: string;
  shapFactors: { feature: string; impact: number; description: string }[];
  privacyMasked: boolean;
}

export interface HospitalMetrics {
  totalPatients: number;
  readmissionRate: number;
  nationalBenchmark: number;
  totalPenalties: number;
  avoidableReadmissions: number;
  wardStats: Record<string, { total: number; readmitted: number }>;
  privacyCompliance: {
    status: string;
    maskedIdentifiers: string[];
    activeHashing: string;
  };
}

export interface PipelineStep {
  step: number;
  title: string;
  description: string;
  sql: string;
}
