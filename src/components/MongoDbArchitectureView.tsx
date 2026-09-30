import React, { useState } from 'react';
import { Database, Server, FileText, CheckCircle2 } from 'lucide-react';

export const MongoDbArchitectureView: React.FC = () => {
  const [dbType, setDbType] = useState<'MongoDB' | 'PostgreSQL'>('MongoDB');

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Database className="w-4 h-4" />
          <span>Database Architecture & NoSQL / SQL Schema Design</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">MongoDB Document Store & SQL Relational Schema</h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Designed for high-throughput hospital readmission analytics. Compare MongoDB NoSQL document collections (optimized for nested patient vitals & SHAP factors) with PostgreSQL relational tables.
        </p>
      </div>

      {/* Database Switcher */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <Server className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-900 text-sm">Select Database Architecture Model:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setDbType('MongoDB')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dbType === 'MongoDB' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            MongoDB (NoSQL Document Store)
          </button>
          <button
            onClick={() => setDbType('PostgreSQL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dbType === 'PostgreSQL' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            PostgreSQL (Relational Schema)
          </button>
        </div>
      </div>

      {/* Code / Schema View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm">
              {dbType === 'MongoDB' ? 'MongoDB Schema: patients collection (Embedded Admissions & SHAP Factors)' : 'PostgreSQL Schema: normalized relational tables'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">Production Ready</span>
        </div>

        <div className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
          <pre>
            <code>
              {dbType === 'MongoDB' ? `{
  "_id": ObjectId("64a8f92b1c3d4e5f6a7b8c9d"),
  "patient_id": "PT-84920",
  "masked_initials": "R. K.",
  "demographics": {
    "age": 72,
    "gender": "Male",
    "ward_type": "Cardiology"
  },
  "clinical_vitals": {
    "hba1c": 8.9,
    "blood_pressure": "158/98",
    "serum_creatinine": 2.1,
    "heart_rate": 88
  },
  "risk_analytics": {
    "risk_score": 84,
    "risk_category": "High",
    "charlson_index": 4,
    "readmitted_30_days": true
  },
  "shap_factors": [
    { "feature": "Charlson Comorbidity Index", "impact": 32, "description": "4 chronic conditions" },
    { "feature": "Elevated Serum Creatinine", "impact": 28, "description": "2.1 mg/dL" }
  ],
  "privacy_masked": true,
  "created_at": ISODate("2026-06-18T10:30:00Z")
}` : `CREATE TABLE patients (
    patient_id VARCHAR(32) PRIMARY KEY,
    masked_initials VARCHAR(16),
    age INT,
    gender VARCHAR(16),
    ward_type VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clinical_records (
    record_id SERIAL PRIMARY KEY,
    patient_id VARCHAR(32) REFERENCES patients(patient_id),
    hba1c DECIMAL(4,2),
    blood_pressure VARCHAR(16),
    creatinine DECIMAL(4,2),
    charlson_index INT,
    risk_score INT,
    risk_category VARCHAR(16),
    readmitted_30_days BOOLEAN
);

CREATE INDEX idx_patient_risk ON clinical_records(risk_score DESC);`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
